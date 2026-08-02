"use client";

import { useEffect, useState } from "react";

type Currency = {
    code: string;
    name: string;
    symbol: string;
};

type Country = {
    code: string;
    name: string;
    capital: string;
    emoji: string;
    region: string;
    currencies: Currency[];
    population: number;
    timezones: string[];
};

type CountriesApiResponse = {
    countries?: Country[];
    error?: string;
};

export default function CountriesWidget() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");

    useEffect(() => {
        async function fetchCountries() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/countries");

                const result: CountriesApiResponse = await response.json();

                if (!response.ok) {
                    throw new Error(result.error ?? "Failed to load countries");
                }

                if (!result.countries) {
                    throw new Error("Countries data is missing");
                }

                setCountries(result.countries);
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchCountries();
    }, []);

    const regions = Array.from(
        new Set(countries.map((country) => country.region))
    ).sort();

    const filteredCountries = countries.filter((country) => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        const matchesSearch = country.name
            .toLowerCase()
            .startsWith(normalizedSearch);

        const matchesRegion =
            selectedRegion === "" || country.region === selectedRegion;

        return matchesSearch && matchesRegion;
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

            <label htmlFor="country-search">
                Search by country name
            </label>

            <input
                id="country-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="For example, Israel"
            />

            <label htmlFor="region-filter">
                Filter by region
            </label>

            <select
                id="region-filter"
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
            >
                <option value="">All regions</option>

                {regions.map((region) => (
                    <option key={region} value={region}>
                        {region}
                    </option>
                ))}
            </select>

            <ul>
                {filteredCountries.map((country) => (
                    <li
                        className="country-item common-gap"
                        key={country.code}
                    >
                        <div className="country-name common-gap">
                            <span aria-hidden="true">{country.emoji}</span>
                            <h3>{country.name}</h3>
                        </div>

                        <div className="country-details common-gap">
                            <p>Capital: {country.capital}</p>
                            <p>Region: {country.region}</p>

                            <p>
                                Currencies:{" "}
                                {country.currencies.length > 0
                                    ? country.currencies
                                        .map(
                                            (currency) =>
                                                `${currency.name} (${currency.code})`
                                        )
                                        .join(", ")
                                    : "Not available"}
                            </p>

                            <p>
                                Population:{" "}
                                {country.population.toLocaleString("en-US")}
                            </p>

                            <p>
                                Time zones:{" "}
                                {country.timezones.length > 0
                                    ? country.timezones.join(", ")
                                    : "Not available"}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            {filteredCountries.length === 0 && (
                <p>No countries found.</p>
            )}
        </section>
    );
}