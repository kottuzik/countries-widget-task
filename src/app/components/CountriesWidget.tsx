"use client";

import { useEffect, useState } from "react";

type Country = {
    code: string;
    name: string;
    capital: string;
    emoji: string;
    continent: string;
};

type ApiCountry = {
    code: string;
    name: string;
    capital: string;
    emoji: string;
    continent: {
        name: string;
    };
};

type CountriesApiResponse = {
    data?: {
        countries: ApiCountry[];
    };
    errors?: {
        message: string;
    }[];
};


export default function CountriesWidget() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedContinent, setSelectedContinent] = useState("");

    useEffect(() => {
        async function fetchCountries() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("https://countries.trevorblades.com/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
            query {
              countries {
                code
                name
                capital
                emoji
                continent {
                  name
                }
              }
            }
          `,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to load countries");
                }

                const result: CountriesApiResponse = await response.json();

                if (result.errors?.length) {
                    throw new Error(result.errors[0].message);
                }

                if (!result.data) {
                    throw new Error("Countries data is missing");
                }

                const formattedCountries: Country[] = result.data.countries.map(
                    (country) => ({
                        code: country.code,
                        name: country.name,
                        capital: country.capital,
                        emoji: country.emoji,
                        continent: country.continent.name,
                    })
                );

                setCountries(formattedCountries);
            } catch (error) {
                setError(
                    error instanceof Error ? error.message : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchCountries();
    }, []);

    const continents = Array.from(
        new Set(countries.map((country) => country.continent))
    ).sort()

    const filteredCountries = countries.filter((country) => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const matchesSearch = country.name
            .toLowerCase()
            .startsWith(normalizedSearch);

        const matchesContinent =
            selectedContinent === "" || country.continent === selectedContinent;

        return matchesSearch && matchesContinent;
    });

    if (loading) {
        return <p>Loading countries...</p>;
    }

    if (error) {
        return <p role="alert">Error: {error}</p>;
    }

    return (
        <section className="country-widget">
            <h2>Countries</h2>
            <p>Explore countries around the world</p>

            <label htmlFor="country-search">Search by country name</label>

            <input
                id="country-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="For example, Israel"
            />
            <label htmlFor="continent-filter">Filter by continent</label>

            <select
                id="continent-filter"
                value={selectedContinent}
                onChange={(event) => setSelectedContinent(event.target.value)}
            >
                <option value="">All continents</option>
                {continents.map((continent)=>(
                    <option key={continent} value={continent}>
                        {continent}
                    </option>
                ))}
            </select>

            <ul>
                {filteredCountries.map((country) => (
                    <li className="country-item common-gap" key={country.code}>
                        <div className="country-name common-gap">
                            <span aria-hidden="true">{country.emoji}</span>
                            <h2>{country.name}</h2>
                        </div>
                        <div className="country-details common-gap">
                            <p>Capital: {country.capital}</p>
                            <p>Continent: {country.continent}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {filteredCountries.length === 0 && <p>No countries found.</p>}
        </section>
    );
}