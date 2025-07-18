"use server";

import type { PredictionResult, FeatureImportance, Transaction } from "@/lib/definitions";
import { summarizeResults, type SummarizeResultsInput } from "@/ai/flows/summarize-results-flow";
import { askOnData, type AskOnDataInput } from "@/ai/flows/ask-on-data-flow";

// This function handles a single prediction by calling the live Django model.
export async function predictFraud(data: Transaction): Promise<{ result?: PredictionResult; featureImportance?: FeatureImportance[]; error?: string }> {
  // Basic validation
  if (!data || Object.keys(data).length < 10) {
    return { error: "Incomplete transaction data provided." };
  }

  try {
    // =================================================================
    // START: DJANGO ML Model Integration
    // =================================================================
    const djangoEndpoint = process.env.NEXT_PUBLIC_DJANGO_API_ENDPOINT;

    if (!djangoEndpoint) {
      throw new Error("The Django API endpoint is not configured. Please set NEXT_PUBLIC_DJANGO_API_ENDPOINT in your environment variables.");
    }

    const response = await fetch(djangoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
       const errorBody = await response.text();
      // NOTE: Remember to configure CORS on your Django backend to allow requests
      // from your Next.js frontend's domain. A popular package for this is `django-cors-headers`.
      throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
    }

    const modelPrediction = await response.json();
    console.log("Response from Django:", JSON.stringify(modelPrediction, null, 2));

    // Robustly find the risk score key
    const riskScoreKey = Object.keys(modelPrediction).find(key => key.toLowerCase().includes('score'));
    if (!riskScoreKey) {
        throw new Error("The backend response did not include a 'risk_score' or similar field.");
    }
    const riskScoreValue = modelPrediction[riskScoreKey];

    const result: PredictionResult = {
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      prediction: modelPrediction.prediction === 1 ? 'Fraudulent' : 'Not Fraudulent',
      riskScore: parseFloat(riskScoreValue),
    };

    // Conditionally handle feature importance to prevent crashes
    let featureImportance: FeatureImportance[] = [];
    if (modelPrediction.feature_importance) {
        featureImportance = Object.entries(modelPrediction.feature_importance)
            .map(([feature, importance]) => ({
                feature,
                importance: importance as number,
            }))
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 10);
    }

    return { result, featureImportance };
    // =================================================================
    // END: DJANGO ML Model Integration
    // =================================================================

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during prediction.";
    return { error: errorMessage };
  }
}

// This function handles batch prediction from a CSV.
export async function batchPredictFraud(fileName: string): Promise<{ results?: PredictionResult[]; featureImportance?: FeatureImportance[]; error?: string }> {
   await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate processing time

  if (!fileName) {
    return { error: "No file provided for batch prediction." };
  }
  
  try {
    const results: PredictionResult[] = Array.from({ length: 15 }, (_, i) => {
      const riskScore = Math.random();
      const prediction: 'Fraudulent' | 'Not Fraudulent' = riskScore > 0.8 ? 'Fraudulent' : 'Not Fraudulent';
      return {
        id: `batch_${i+1}_${Math.random().toString(36).substr(2, 9)}`,
        V1: Math.random() * 10,
        V2: Math.random() * 10,
        V3: Math.random() * 10,
        V4: Math.random() * 10,
        V5: Math.random() * 10,
        V6: Math.random() * 10,
        V7: Math.random() * 10,
        V8: Math.random() * 10,
        V9: Math.random() * 10,
        V10: Math.random() * 10,
        prediction,
        riskScore: parseFloat(riskScore.toFixed(2)),
      };
    });

     const MOCK_FEATURE_IMPORTANCE: FeatureImportance[] = [
      { feature: 'V17', importance: 0.18 },
      { feature: 'V14', importance: 0.15 },
      { feature: 'V12', importance: 0.12 },
      { feature: 'V10', importance: 0.10 },
      { feature: 'V11', importance: 0.09 },
      { feature: 'V16', importance: 0.08 },
      { feature: 'V7', importance: 0.07 },
      { feature: 'V4', importance: 0.06 },
      { feature: 'V3', importance: 0.05 },
      { feature: 'V9', importance: 0.04 },
    ];


    return { results, featureImportance: MOCK_FEATURE_IMPORTANCE };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred during batch processing.";
    return { error: errorMessage };
  }
}

export async function getSummary(results: PredictionResult[]): Promise<{summary?: string; error?: string}> {
  try {
    const input: SummarizeResultsInput = { results: results.map(r => ({...r})) };
    const { summary } = await summarizeResults(input);
    return { summary };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate summary.'}
  }
}

export async function getAnswer(question: string, results: PredictionResult[]): Promise<{answer?: string; error?: string}> {
    if (results.length === 0) {
        return { answer: "I can't answer questions until some transaction data is available. Please run a prediction first." };
    }
    if (!question) {
        return { error: "Please provide a question." };
    }
    try {
        const input: AskOnDataInput = { question, results };
        const { answer } = await askOnData(input);
        return { answer };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get an answer from the AI.' };
    }
}