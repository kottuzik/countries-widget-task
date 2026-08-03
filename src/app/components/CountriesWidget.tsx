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
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
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
                    throw new Error(
                        result.error ?? "Failed to load countries"
                    );
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

    const filteredCountries = countries.filter((country) =>
        country.name
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase())
    );

    function handleCountrySelect(country: Country) {
        setSelectedCountryCode(country.code);
        setSearchQuery(country.name);
        setIsOpen(false);
    }

    function handleClear() {
        setSearchQuery("");
        setSelectedCountryCode("")
        setIsOpen(true);
      }
    if (loading) {
        return <p>Loading countries...</p>;
    }

    if (error) {
        return <p role="alert">Error: {error}</p>;
    }

    return (
        <section className={styles["country-widget"]}>
            <h2>Countries</h2>
            <p>Explore countries around the world</p>

            <label htmlFor="country-search">
                Choose a country
            </label>

            <div className={styles["country-select"]}>
                <input
                    id="country-search"
                    className={styles["country-search"]}
                    type="text"
                    value={searchQuery}
                    placeholder="Search for a country"
                    autoComplete="off"
                    onFocus={() => setIsOpen(true)}
                    onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setSelectedCountryCode("");
                        setIsOpen(true);
                    }}
                />

                {
                    searchQuery && (
                        <button
                            className={styles["country-clear"]}
                            type="button"
                            aria-label="Clear selected country"
                            onClick={handleClear}
                        >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M6 6L18 18M18 6L6 18"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        </button>
                    )
                }
                <button
                    className={styles["country-toggle"]}
                    type="button"
                    aria-label={
                        isOpen ? "Close countries list" : "Open countries list"
                    }
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((previousState) => !previousState)}
                >
                <svg
                    className={`${styles["country-arrow"]} 
                    ${isOpen ? styles["country-arrow-open"] : ""}`}

                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                </button>

                {isOpen && (
                    <ul className={styles["country-list"]}>
                        {filteredCountries.map((country) => (
                            <li key={country.code}>
                                <button
                                    className={styles["country-option"]}
                                    type="button"
                                    onClick={() =>
                                        handleCountrySelect(country)
                                    }
                                >
                                    <span aria-hidden="true">
                                        {country.emoji}
                                    </span>

                                    <span>{country.name}</span>
                                </button>
                            </li>
                        ))}

                        {filteredCountries.length === 0 && (
                            <li className={styles["no-results"]}>
                                No countries found
                            </li>
                        )}
                    </ul>
                )}
            </div>

            {selectedCountry && (
                <article
                    className={styles["country-item"]}
                    aria-live="polite"
                >
                    <div className={styles["country-name"]}>
                        <span aria-hidden="true">
                            {selectedCountry.emoji}
                        </span>

                        <h3>{selectedCountry.name}</h3>
                    </div>

                    <div className={styles["country-details"]}>
                        <p>
                            <span>Capital:</span> <span>{selectedCountry.capital}</span>
                        </p>

                        <p>
                            <span>Region:</span> <span>{selectedCountry.region}</span>
                        </p>

                        <p>
                           <span> Currencies:{" "}</span>
                            {selectedCountry.currencies.length > 0
                                ? selectedCountry.currencies.map((currency, index) => (
                                    <span key={currency.code} className={styles["country-currency"]}>
                                      ({currency.name}) {currency.code} ({currency.symbol || ""})
                                      {index < selectedCountry.currencies.length - 1 && ", "}
                                  </span>
                                ))
                                : "Not available"}
                        </p>

                        <p>
                            <span>Population:{" "}</span>
                            <span>
                                {selectedCountry.population.toLocaleString(
                                    "en-US"
                                )}
                            </span>
                        </p>

                        <p>
                            <span>Time zones:{" "}</span>
                            <span>
                                {selectedCountry.timezones.length > 0
                                    ? selectedCountry.timezones.join(", ")
                                    : "Not available"}
                            </span>
                        </p>
                    </div>
                </article>
            )}
        </section>
    );
}