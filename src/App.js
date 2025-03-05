import "./ColorPickerApp.css";
import React, { useState } from "react";
const ColorPickerApp = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [image, setImage] = useState(null);
  const [savedColors, setSavedColors] = useState([]);
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleColorPick(event) {
    if (!image) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b] = pixel;
      const hex = `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

      setSelectedColor({ hex, r, g, b });
      setSavedColors((prev) => [...prev, { hex, r, g, b }]);
    };
  }

  return (
    <div className="app-container">
      <h1>Color Picker App</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div className="image-container">
          <img
            src={image}
            alt="Uploaded"
            className="uploaded-image"
            onClick={handleColorPick}
          />
        </div>
      )}
      {selectedColor && (
        <div className="color-info">
          <p>HEX: {selectedColor.hex}</p>
          <p>
            RGB: {selectedColor.r}, {selectedColor.g}, {selectedColor.b}
          </p>
        </div>
      )}
      {savedColors.length > 0 && (
        <div className="saved-colors">
          <h2>Saved Colors</h2>
          <ul>
            {savedColors.map((color, index) => (
              <li key={index} style={{ background: color.hex }}>
                {color.hex} (RGB: {color.r}, {color.g}, {color.b})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ColorPickerApp;
