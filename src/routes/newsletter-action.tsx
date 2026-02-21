import { globalAction$, zod$, z } from "@builder.io/qwik-city";

export const useNewsletterSignup = globalAction$(
  async (data, { env }) => {
    const MAILCHIMP_API_KEY = env.get("MAILCHIMP_API_KEY") || "";
    const MAILCHIMP_AUDIENCE_ID = env.get("MAILCHIMP_AUDIENCE_ID") || "";
    // Extract data center from API key (e.g., "us4" from "xxx-us4")
    const MAILCHIMP_DC = MAILCHIMP_API_KEY.split("-").pop() || "us4";

    const url = `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
        },
        body: JSON.stringify({
          email_address: data.email,
          status: "subscribed",
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Successfully subscribed!",
        };
      } else {
        // Handle specific Mailchimp errors
        if (result.title === "Member Exists") {
          return {
            success: true,
            message: "You're already subscribed!",
          };
        }
        return {
          success: false,
          message: result.detail || "Subscription failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      return {
        success: false,
        message: "An error occurred. Please try again later.",
      };
    }
  },
  zod$({
    email: z.string().email("Please enter a valid email address"),
  })
);
