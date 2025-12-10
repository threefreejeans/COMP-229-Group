import React, { useEffect, useState } from "react";
import "../styles/surveyForm.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SurveyForm = () => {
  const [survey, setSurvey] = useState(null);
  const [loadingSurvey, setLoadingSurvey] = useState(true);
  const [surveyError, setSurveyError] = useState("");

  // Brands & answers
  const [brandOptions, setBrandOptions] = useState([]);   // from Survey.brandOptions
  const [selectedBrands, setSelectedBrands] = useState([]); // array of brand labels
  const [brandCounts, setBrandCounts] = useState({});       // { "Nike": "2", "Adidas": "1" }
  const [noneSelected, setNoneSelected] = useState(false);

  // Demographics
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");

  // ─────────────────────────────────────────
  // 1. Fetch an active survey from backend
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/surveys`);
        if (!res.ok) {
          setSurveyError(`Failed to load survey (status ${res.status})`);
          return;
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          setSurveyError("No surveys are available.");
          return;
        }

        // Pick first active survey, or fall back to first survey
        const active =
          data.find((s) => s.isActive === true) || data[0];

        setSurvey(active);

        // Use brandOptions from survey if present, otherwise default to 4 generic brands
        const options =
          Array.isArray(active.brandOptions) && active.brandOptions.length > 0
            ? active.brandOptions
            : ["Brand 1", "Brand 2", "Brand 3", "Brand 4"];

        setBrandOptions(options);
      } catch (err) {
        console.error(err);
        setSurveyError("Error loading survey from server.");
      } finally {
        setLoadingSurvey(false);
      }
    };

    fetchSurvey();
  }, []);

  // ─────────────────────────────────────────
  // 2. Handlers for brand selection & counts
  // ─────────────────────────────────────────
  const handleBrandCheckbox = (label, checked) => {
    setSelectedBrands((prev) => {
      if (checked) {
        // turn off "none" if any brand is selected
        setNoneSelected(false);
        if (prev.includes(label)) return prev;
        return [...prev, label];
      } else {
        // if unchecked, remove from selected list and clear its count
        const updated = prev.filter((b) => b !== label);
        setBrandCounts((old) => {
          const copy = { ...old };
          delete copy[label];
          return copy;
        });
        return updated;
      }
    });
  };

  const handleNoneChange = (checked) => {
    setNoneSelected(checked);
    if (checked) {
      // clear all brand selections and counts
      setSelectedBrands([]);
      setBrandCounts({});
    }
  };

  const handleBrandCountChange = (label, value) => {
    setBrandCounts((prev) => ({
      ...prev,
      [label]: value,
    }));
  };

  // ─────────────────────────────────────────
  // 3. Submit handler – build payload for backend
  // ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    let brandsBought = [];
    let brandFrequencies = {}; // Map-like object (brand → count)

    if (noneSelected && selectedBrands.length === 0) {
      brandsBought = ["None of the above"];
      brandFrequencies = { "None of the above": 0 };
    } else {
      if (selectedBrands.length === 0) {
        alert(
          "Please select at least one brand or choose 'None of the above'."
        );
        return;
      }

      // Build arrays/object based on selected brand labels
      selectedBrands.forEach((label) => {
        brandsBought.push(label);
        const count = Number(brandCounts[label]);
        brandFrequencies[label] = Number.isNaN(count) ? 0 : count;
      });
    }

    // Age -> ageRange enum
    const ageNumber = Number(age);
    if (Number.isNaN(ageNumber) || ageNumber <= 0) {
      alert("Please enter a valid age.");
      return;
    }

    let ageRange = "";

    if (ageNumber <= 24) {
      ageRange = "18-24";
    } else if (ageNumber <= 34) {
      ageRange = "25-34";
    } else if (ageNumber <= 44) {
      ageRange = "35-44";
    } else if (ageNumber <= 54) {
      ageRange = "45-54";
    } else {
      ageRange = "55+";
    }


    if (!country) {
      alert("Please provide country.");
      return;
    }

    const payload = {
      brandsBought,       // array of brand labels
      brandFrequencies,   // Map-like object { label: number }
      ageRange,           // enum string
      country,
      // Optional if you link responses to survey:
      // surveyId: survey?._id,
    };

    console.log("[SURVEY] Payload being sent:", payload);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/api/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log("[SURVEY] Response:", res.status, data);

      if (!res.ok) {
        alert(
          (data && (data.message || data.error)) ||
          `Failed to submit survey (status ${res.status})`
        );
        return;
      }

      alert("Thank you for completing the survey!");

      // Reset form
      setSelectedBrands([]);
      setBrandCounts({});
      setNoneSelected(false);
      setAge("");
      setCountry("");
    } catch (err) {
      console.error("[SURVEY] Network or code error:", err);
      alert("There was a problem submitting your survey.");
    }
  };

  // ─────────────────────────────────────────
  // 4. Render
  // ─────────────────────────────────────────
  if (loadingSurvey) {
    return (
      <div className="survey-page">
        <div className="survey-card">
          <p>Loading survey…</p>
        </div>
      </div>
    );
  }

  if (surveyError) {
    return (
      <div className="survey-page">
        <div className="survey-card">
          <h2>Survey Error</h2>
          <p>{surveyError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-page">
      <div className="survey-card">
        <form onSubmit={handleSubmit} className="survey-form">
          {/* Image placeholder */}
          <div className="survey-image-placeholder">
            <span>Image</span>
          </div>

          {/* Survey title & intro */}
          <h1 className="survey-title">
            {survey?.title || "Shoe Brand Survey"}
          </h1>
          <p className="survey-intro">
            {survey?.description ||
              "We are a study group conducting a survey on popular shoe brands. We would like your cooperation."}
          </p>

          {/* Question 1 */}
          <div className="survey-section">
            <p className="survey-question">
              Which of these brands have you bought in the last 12 months?
              <span className="survey-note"> (you may choose more than one)</span>
            </p>

            <div className="survey-brand-grid">
              {brandOptions.map((label) => (
                <label className="survey-checkbox" key={label}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(label)}
                    onChange={(e) =>
                      handleBrandCheckbox(label, e.target.checked)
                    }
                    disabled={noneSelected}
                  />
                  <span>{label}</span>
                </label>
              ))}

              <label className="survey-checkbox">
                <input
                  type="checkbox"
                  checked={noneSelected}
                  onChange={(e) => handleNoneChange(e.target.checked)}
                />
                <span>None of the above</span>
              </label>
            </div>
          </div>

          {/* Question 2 - quantities per brand */}
          <div className="survey-section">
            <p className="survey-question">
              How many pairs of shoes did you buy for each selected brand?
            </p>

            {selectedBrands.length === 0 && !noneSelected && (
              <p className="survey-note">
                Select at least one brand above to enter quantities.
              </p>
            )}

            {selectedBrands.map((label) => (
              <div className="survey-field-row" key={label}>
                <label>{label}</label>
                <input
                  type="number"
                  min="0"
                  value={brandCounts[label] || ""}
                  onChange={(e) =>
                    handleBrandCountChange(label, e.target.value)
                  }
                />
              </div>
            ))}
          </div>

          {/* Demographics */}
          <div className="survey-section">
            <div className="survey-field-row">
              <label>Age:</label>
              <input
                type="number"
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="survey-field-row">
              <label>Country:</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <div className="survey-submit-row">
            <button type="submit" className="survey-submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyForm;
