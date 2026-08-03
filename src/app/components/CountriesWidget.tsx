"use client";

import styles from "./CountriesWidget.module.css";
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
    const [selectedCountryCode, setSelectedCountryCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const selectedCountry = countries.find(
        (country) => country.code === selectedCountryCode
    );
    if(loading) {
        return <p>Loading countries...</p>;
    }
    if (error) {
        return <p role="alert">Error: {error}</p>;
    }

    return (
        <section className={styles["country-widget"]}>
            <h2>Countries</h2>
            <p>Explore countries around the world</p>

            <label htmlFor="country-select">
                Choose a country
            </label>

            <select
                id="country-select"
                value={selectedCountryCode}
                onChange={(event) =>
                    setSelectedCountryCode(event.target.value)
                }>
                <option value="">Select a country</option>
                {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.emoji} {country.name}
                    </option>
                ))}
            </select>

            {selectedCountry && (
                <article
                    className="country-item common-gap"
                    aria-live="polite">
                    <div className="country-name common-gap">
                        <span aria-hidden="true">
                            {selectedCountry.emoji}
                        </span>
                        <h3>{selectedCountry.name}</h3>
                    </div>

                    <div className="country-details common-gap">
                        <p>Capital: {selectedCountry.capital}</p>
                        <p>Region: {selectedCountry.region}</p>

                        <p>
                            Currencies:{" "}
                            {selectedCountry.currencies.length > 0 ? selectedCountry.currencies
                                .map(
                                    (currency) => `(${currency.name}) ${currency.code}`
                                ).join(", ") : "Not available"
                            }
                        </p>
                        <p>
                            Population:{" "}
                            {selectedCountry.population.toLocaleString(
                                "en-US"
                            )}
                        </p>
                        <p>
                            Time zones:{" "}
                            {selectedCountry.timezones.length > 0 ? selectedCountry.timezones.join(", ") : "Not available"}
                        </p>
                    </div>
                </article>
            )}
        </section>
    );
}