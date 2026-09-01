// netlify/functions/chat.js
// This function runs on Netlify's server, not in the browser.
// It holds the Anthropic API key privately and passes chat requests through.
// The front end calls this function instead of calling Anthropic directly.
//
// The actual rules for how the AI talks live in instructions.js, not here —
// edit that file to change tone, safety rules, or anything else about
// behavior. This file just handles the plumbing.

const { buildSystemPrompt } = require("./instructions.js");

exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { messages, max_tokens, threadName, threadVoice } = body;

    if (!messages) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'messages' in request body" }),
      };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server is missing ANTHROPIC_API_KEY" }),
      };
    }

    // The system prompt is always built here, server-side, from
    // instructions.js — never trusted from the browser. This keeps the
    // actual rules private and safe from being seen or tampered with.
    const system = buildSystemPrompt(
      threadName || "The Stars",
      threadVoice || "A quiet place for encouragement."
    );

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: max_tokens || 1000,
        system: system,
        messages: messages,
      }),
    });

    const data = await anthropicResponse.json();

    return {
      statusCode: anthropicResponse.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong: " + err.message }),
    };
  }
};
