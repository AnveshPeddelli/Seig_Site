"use client";

import { useEffect, useState } from "react";
import { getProducts, getQuestions, type Product, type Question } from "../lib/api";

type DashboardData = {
  products: Product[];
  questions: Question[];
};

export function HomeDashboard() {
  const [data, setData] = useState<DashboardData>({
    products: [],
    questions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const [products, questions] = await Promise.all([
          getProducts(),
          getQuestions(),
        ]);

        if (!active) {
          return;
        }

        setData({ products, questions });
      } catch (loadError) {
        if (!active) {
          return;
        }

        const message =
          loadError instanceof Error ? loadError.message : "Unknown error";
        setError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="page-shell">
        <section className="loading">
          <div className="eyebrow">Loading</div>
          <h1>Talking to the backend and preparing the screen...</h1>
          <p className="subtle">
            This is the first UX lesson: never show a blank page while data is on the
            way.
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <section className="error-state">
          <div className="eyebrow">Connection Error</div>
          <h1>Frontend is fine, but the backend call failed.</h1>
          <p className="subtle">
            Make sure the backend is running on{" "}
            <span className="inline-code">http://localhost:5000</span>.
          </p>
          <p className="subtle">{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="eyebrow">Small Next.js Demo</div>
        <div className="hero-grid">
          <div>
            <h1>Design the UI around actions, not just data.</h1>
            <p>
              This page is intentionally small. It shows how a React component loads
              backend data, renders useful sections, and uses spacing, cards, color,
              motion, and status feedback to feel alive instead of static.
            </p>

            <div className="metrics">
              <article className="metric-card">
                <strong>{data.products.length}</strong>
                <span>Products from the backend</span>
              </article>
              <article className="metric-card">
                <strong>{data.questions.length}</strong>
                <span>Questions ready for the flow</span>
              </article>
              <article className="metric-card">
                <strong>1</strong>
                <span>Vendor in the sample seed</span>
              </article>
            </div>
          </div>

          <aside className="hero-callout panel">
            <h2>Why this page works</h2>
            <p>
              The screen has one clear story: “here is the product catalog and here is
              the questionnaire driving recommendations.” That makes the layout easy to
              scan and easy to extend later.
            </p>
            <ul>
              <li>Big heading for hierarchy</li>
              <li>Metrics for quick orientation</li>
              <li>Cards for grouped content</li>
              <li>Soft motion on hover for liveliness</li>
              <li>Loading and error states for real UX</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Products</h2>
              <p>
                This section comes from <span className="inline-code">GET /products</span>.
              </p>
            </div>
            <div className="status-pill">Live backend data</div>
          </div>

          <div className="product-list">
            {data.products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-top">
                  <div>
                    <h3>{product.name}</h3>
                    <p className="subtle">
                      Sold by {product.vendors[0]?.vendor.name ?? "Unknown vendor"} in{" "}
                      {product.vendors[0]?.vendor.location ?? "Unknown location"}
                    </p>
                  </div>
                  <div className="product-price">Rs. {product.price}</div>
                </div>

                <div className="chip-row">
                  {product.specs.map((spec) => (
                    <span key={spec.id} className="chip">
                      {spec.specification.name}: {spec.value}
                    </span>
                  ))}
                  <span className="chip">
                    Stock: {product.vendors[0]?.stock ?? 0}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Questionnaire</h2>
              <p>
                This section comes from <span className="inline-code">GET /questions</span>.
              </p>
            </div>
            <div className="status-pill">Recommendation input</div>
          </div>

          <div className="question-list">
            {data.questions.map((question) => (
              <article key={question.id} className="question-card">
                <div className="question-top">
                  <h3>{question.text}</h3>
                  <span className="chip">{question.options.length} options</span>
                </div>

                <div className="option-list">
                  {question.options.map((option) => (
                    <div key={option.id} className="option-item">
                      <div>
                        <strong>{option.text}</strong>
                        <span>
                          Matches {option.products.map((product) => product.name).join(", ")}
                        </span>
                      </div>
                      <span className="chip">id: {option.id}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="connection-box">
        <h2>How this page is connected</h2>
        <p className="subtle">
          This is the simple beginner-friendly chain: UI component -&gt; API helper -&gt;
          backend route -&gt; database.
        </p>

        <div className="connection-flow">
          <article className="flow-card">
            <strong>1. React component</strong>
            <p className="subtle">
              <span className="inline-code">components/home-dashboard.tsx</span> uses{" "}
              <span className="inline-code">useEffect</span> to load data after the page
              opens.
            </p>
          </article>

          <article className="flow-card">
            <strong>2. API helper</strong>
            <p className="subtle">
              <span className="inline-code">lib/api.ts</span> contains reusable functions
              like <span className="inline-code">getProducts()</span> and{" "}
              <span className="inline-code">getQuestions()</span>.
            </p>
          </article>

          <article className="flow-card">
            <strong>3. Express backend</strong>
            <p className="subtle">
              Those helpers call <span className="inline-code">http://localhost:5000/products</span>{" "}
              and <span className="inline-code">/questions</span>, then the backend talks to
              Prisma and PostgreSQL.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
