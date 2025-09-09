"use client";
import { useEffect } from "react";

export default function AuthorizedPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    const savedState = sessionStorage.getItem("pkce_state");

    if (!savedState) {
      console.warn("No PKCE state found in sessionStorage. Maybe opened in a new tab?");
      return;
    }

    if (state !== savedState) {
      console.error("Invalid state");
      return;
    }
    console.log("State is valid, continue exchanging code for tokens...");
    
    const codeVerifier = sessionStorage.getItem("pkce_verifier");
    if (!code || !codeVerifier) {
      console.error("Missing code or verifier");
      return;
    }

    const exchangeToken = async () => {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        code_verifier: codeVerifier,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/oauth2/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        }
      );

      if (!response.ok) {
        const err = await response.text();
        console.error("Token exchange failed:", err);
        return;
      }

      const data = await response.json();
      console.log("Tokens:", data);

      // Save tokens in memory/localStorage/sessionStorage as needed
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("id_token", data.id_token);
    };

    exchangeToken();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <h1 className="text-xl font-bold">Completing login...</h1>
    </div>
  );
}
