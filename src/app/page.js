"use client";
import { generateCodeVerifier, generateCodeChallenge } from "@/lib/pkce";

export default function LoginPage() {
  const handleLogin = async () => {
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // store verifier for later token exchange
    sessionStorage.setItem("pkce_verifier", verifier);

    const state = crypto.randomUUID();
    sessionStorage.setItem("pkce_state", state);

    const authUrl = `${process.env.NEXT_PUBLIC_AUTH_URL}/oauth2/authorize?` +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI, // must match DB
        scope: process.env.NEXT_PUBLIC_SCOPES,
        code_challenge: challenge,
        code_challenge_method: "S256",
        state,
      });

    window.location.href = authUrl;
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <button
        onClick={handleLogin}
        className="bg-white px-6 py-3 rounded-xl shadow-lg text-lg font-semibold hover:bg-gray-100 transition"
      >
        Login with Authorization Server
      </button>
    </div>
  );
}
