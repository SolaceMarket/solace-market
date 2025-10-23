import { createAccount } from "@/alpaca/accounts/createAccount";

try {
  const account = await createAccount({
    account_type: "omnibus_sub",
    primary_account_holder_id: "7753779SW",
    contact: {
      email_address: "john.doe@example.com",
      phone_number: "+15556667788",
      street_address: ["20 N San Mateo Dr", "20 N San Mateo Dr"],
      unit: "et mag",
      city: "San Mateo",
      state: "CA",
      postal_code: "94401",
    },
    identity: {
      given_name: "John",
      family_name: "Two",
      date_of_birth: "1990-01-01",
      tax_id: "666-55-4322",
      tax_id_type: "USA_SSN",
      country_of_citizenship: "AUS",
      country_of_birth: "AUS",
      country_of_tax_residence: "USA",
      funding_source: ["employment_income"],
      annual_income_min: "10000",
      annual_income_max: "10000",
      total_net_worth_min: "10000",
      total_net_worth_max: "10000",
      liquid_net_worth_min: "10000",
      liquid_net_worth_max: "10000",
      liquidity_needs: "does_not_matter",
      investment_experience_with_stocks: "over_5_years",
      investment_experience_with_options: "over_5_years",
      risk_tolerance: "conservative",
      investment_objective: "market_speculation",
      investment_time_horizon: "more_than_10_years",
      marital_status: "MARRIED",
      number_of_dependents: 5,
    },
    disclosures: {
      is_control_person: false,
      is_affiliated_exchange_or_finra: false,
      is_politically_exposed: false,
      immediate_family_exposed: false,
    },
    agreements: [
      {
        agreement: "margin_agreement",
        signed_at: "2020-09-11T18:09:33Z",
        ip_address: "185.13.21.99",
        // revision: "16.2021.05",
      },
      {
        agreement: "account_agreement",
        signed_at: "2020-09-11T18:13:44Z",
        ip_address: "185.13.21.99",
        // revision: "16.2021.05",
      },
      // {
      //   agreement: "options_agreement",
      //   signed_at: "2020-09-11T18:13:44Z",
      //   ip_address: "185.13.21.99",
      //   // revision: "16.2021.05",
      // },
      {
        agreement: "customer_agreement",
        signed_at: "2019-09-11T18:09:33Z",
        ip_address: "185.13.21.99",
        // revision: "16.2021.05",
      },
      {
        agreement: "crypto_agreement",
        signed_at: "2020-09-11T18:13:44Z",
        ip_address: "185.13.21.99",
        revision: "04.2021.10",
      },
    ],
    documents: [
      {
        document_type: "identity_verification",
        document_sub_type: "passport",
        content: "/9j/Cg==",
        mime_type: "image/jpeg",
      },
      {
        document_type: "identity_verification",
        document_sub_type: "passport",
        content: "/9j/Cg==",
        mime_type: "image/jpeg",
      },
    ],
    trusted_contact: {
      given_name: "Jane",
      family_name: "Doe",
      email_address: "jane.doe@example.com",
    },
    enabled_assets: [
      "us_equity",
      //  "us_option"
    ],
  });

  console.log("Created account:", account);
} catch (error) {
  console.error("Error creating account:", error);
}
