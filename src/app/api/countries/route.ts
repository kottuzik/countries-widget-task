import { NextResponse } from "next/server";

type RestCountry = {
    names: {
        common: string;
    };
    codes: {
        alpha_2: string;
    };
    capitals: {
        name: string;
    }[];
    flag: {
        emoji: string;
    };
    region: string;
    currencies: {
        code: string;
        name: string;
        symbol: string;
    }[];
    population: number;
    timezones: string[];
};

type RestCountriesResponse = {
    data?: {
        objects: RestCountry[];
        meta: {
            count: number;
            more: boolean;
        };
    };
    errors?: {
        message: string;
    }[];
};

export async function GET() {
    const apiKey = process.env.REST_COUNTRIES_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "REST Countries API key is missing" },
            { status: 500 }
        );
    }

    try {
        const allCountries: RestCountry[] = [];

        let offset = 0;
        let hasMoreCountries = true;

        while (hasMoreCountries) {
            const parameters = new URLSearchParams({
                limit: "100",
                offset: offset.toString(),
                response_fields: [
                    "names.common",
                    "codes.alpha_2",
                    "capitals",
                    "flag.emoji",
                    "region",
                    "currencies",
                    "population",
                    "timezones",
                ].join(","),
            });

            const response = await fetch(
                `https://api.restcountries.com/countries/v5?${parameters}`,
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                    },
                    next: {
                        revalidate: 86400,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load countries");
            }

            const result: RestCountriesResponse = await response.json();

            if (result.errors?.length) {
                throw new Error(result.errors[0].message);
            }

            if (!result.data) {
                throw new Error("Countries data is missing");
            }

            allCountries.push(...result.data.objects);

            hasMoreCountries = result.data.meta.more;
            offset += result.data.meta.count;
        }

        const countries = allCountries.map((country) => ({
            code: country.codes.alpha_2,
            name: country.names.common,
            capital: country.capitals[0]?.name ?? "No capital",
            emoji: country.flag.emoji,
            region: country.region,
            currencies: country.currencies,
            population: country.population,
            timezones: country.timezones,
        }));

        return NextResponse.json({ countries });
    } catch (error) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : "Something went wrong",
            },
            { status: 500 }
        );
    }
}