import React, { useState } from "react";
import "../styles/surveyForm.css"

const SurveyForm = () => {
  const [brands, setBrands] = useState({
    brand1: false,
    brand2: false,
    brand3: false,
    brand4: false,
    none: false,
  });

    const [numbers, setNumbers] = useState({
        brand1: "",
        brand2: "",
        brand3: "",
        brand4: "",
        age: "",
        country: "",
    });

const handleBrandChange = (e) => {
  const { name, checked } = e.target;

  if (name === "none") {
    // If "None of the above" is checked, clear all brands + their counts
    setBrands({
      brand1: false,
      brand2: false,
      brand3: false,
      brand4: false,
      none: checked,
    });
    setNumbers((prev) => ({
      ...prev,
      brand1: "",
      brand2: "",
      brand3: "",
      brand4: "",
    }));
  } else {
    setBrands((prev) => ({
      ...prev,
      [name]: checked,
      none: false, // uncheck "none" if any brand is selected
    }));

    // If a brand is turned OFF, clear its count
    if (!checked) {
      setNumbers((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }
};


  const handleNumChange = (e) => {
    const { name, value } = e.target;
    setNumbers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Survey submitted:", { brands, numbers });
    alert("Thank you for completing the survey!");
  };

  return (
    <div className="survey-page">
      <div className="survey-card">
        <form onSubmit={handleSubmit} className="survey-form">
          {/* Image placeholder */}
          <div className="survey-image-placeholder">
            <span>Image</span>
          </div>

          {/* Welcome text */}
          <h1 className="survey-title">WELCOME</h1>
          <p className="survey-intro">
            We are a study group conducting a survey on popular shoe brands.
            We would like your cooperation.
          </p>

          {/* Question 1 */}
          <div className="survey-section">
            <p className="survey-question">
              Which of these brands have you bought in the last 12 months?
              <span className="survey-note"> (pick more than one)</span>
            </p>

            <div className="survey-brand-grid">
              <label className="survey-checkbox">
                <input
                  type="checkbox"
                  name="brand1"
                  checked={brands.brand1}
                  onChange={handleBrandChange}
                />
                <span>Brand 1</span>
              </label>

              <label className="survey-checkbox">
                <input
                  type="checkbox"
                  name="brand3"
                  checked={brands.brand3}
                  onChange={handleBrandChange}
                />
                <span>Brand 3</span>
              </label>

              <label className="survey-checkbox">
                <input
                  type="checkbox"
                  name="none"
                  checked={brands.none}
                  onChange={handleBrandChange}
                />
                <span>None of the above</span>
              </label>

              <label className="survey-checkbox">
                <input
                  type="checkbox"
                  name="brand2"
                  checked={brands.brand2}
                  onChange={handleBrandChange}
                />
                <span>Brand 2</span>
              </label>

              <label className="survey-checkbox">
                <input
                  type="checkbox"
                  name="brand4"
                  checked={brands.brand4}
                  onChange={handleBrandChange}
                />
                <span>Brand 4</span>
              </label>
            </div>
          </div>

                  {/* Question 2 */}
                  <div className="survey-section">
                      <p className="survey-question">
                          How many pairs of shoes did you buy for each brand?
                      </p>

                      {/* Render one row per selected brand */}
                      {["brand1", "brand2", "brand3", "brand4"].map((key) => {
                          if (!brands[key]) return null; // only show if checkbox is selected

                          const label =
                              key === "brand1"
                                  ? "Brand 1"
                                  : key === "brand2"
                                      ? "Brand 2"
                                      : key === "brand3"
                                          ? "Brand 3"
                                          : "Brand 4";

                          return (
                              <div className="survey-field-row" key={key}>
                                  <label>{label}</label>
                                  <input
                                      type="number"
                                      min="0"
                                      name={key}
                                      value={numbers[key]}
                                      onChange={handleNumChange}
                                  />
                              </div>
                          );
                      })}
                  </div>


          {/* Demographics */}
          <div className="survey-section">
            <div className="survey-field-row">
              <label>Age:</label>
              <input
                type="number"
                min="0"
                name="age"
                value={numbers.age}
                onChange={handleNumChange}
                required
              />
            </div>

            <div className="survey-field-row">
              <label>Country:</label>
              <input
                type="text"
                name="country"
                value={numbers.country}
                onChange={handleNumChange}
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
