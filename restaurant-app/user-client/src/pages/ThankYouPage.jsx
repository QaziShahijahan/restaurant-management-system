import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ThankYouPage() {
  const nav = useNavigate();
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    if (counter === 0) {
      nav("/", { replace: true });
      return;
    }
    const t = setTimeout(() => setCounter(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [counter, nav]);

  return (
    <div className="thanks-shell">
      <div className="thanks-card">
        <h2>Thanks For Ordering</h2>
        <div className="check">✔</div>
        <p>Redirecting in {counter}</p>
      </div>
    </div>
  );
}
