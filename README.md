# Dune Weaver Text Compiler

A unified, browser-based serial interface and text-to-path compiler for kinetic sand tables. This tool translates standard alphanumeric text into continuous, machine-ready Theta-Rho (`.thr`) coordinate paths. 

It includes a custom single-stroke proportional font engine and a parametric math pipeline capable of wrapping text around complex geometric profiles like Archimedean spirals, concentric circles, and Cassini peanuts.

## Features
* **Custom Pathing Engine:** Transforms strings into continuous vectors using a custom retraced proportional font, minimizing gantry travel time and eliminating sand drags between characters.
* **Complex Geometric Projections:** Projects flat text along various parametric curves:
  * Centered Block Stack
  * Concentric Circular Ring Bend
  * Continuous Archimedean Spiral Wrap
  * Rolling Sine Wave Horizontal Ribbon
  * The Gentle Ellipse
  * The Soft Petal (5-Ripple)
  * The Cassini Peanut
  * The Perimeter Squircle
* **Live Virtual Twin:** Real-time, Retina-ready HTML5 Canvas rendering of the calculated sand path.
* **Pi Telemetry Dashboard:** Tracks vector output nodes, calculated font scale, and rotational matrix loops.
* **Direct Hardware Interfacing:** Streams coordinates directly to a Raspberry Pi serial interface (via UART endpoint) with adjustable millisecond feedrates, or saves the `.thr` file directly to the controller's storage.
* **Standalone Export:** Works completely offline to generate and download `.thr` files for manual transfer.

## Project Structure
The entire application is currently contained within a single `text.html` file, which includes:
1.  **`ProportionalRetracedFont`:** A static dictionary containing the vector spline data for all supported alphanumeric characters and symbols.
2.  **`DuneWeaverPipeline`:** The core mathematical engine that handles word-wrapping, arc-length parameterization, curve projection, and cartesian-to-polar coordinate transformations.
3.  **UI Controller:** Handles local storage state caching, debounced user inputs, and network requests (`fetch`) to the local motor controller backend.

## Usage
### Standalone Mode (No Hardware)
1. Open `text.html` in any modern web browser.
2. Enter your text, select a geometric profile, and view the generated path.
3. Click **Download THR** to save the Theta-Rho file to your local machine.

### Networked/Raspberry Pi Mode
To use the **Save to Table** and **Stream Live to Gantry** buttons, the `text.html` file must be served from (or proxied to) a backend controller (like a Raspberry Pi running a Python/Node.js web server) that exposes the following endpoints:
*   `POST /api/upload_theta_rho`: Accepts a `.thr` file payload and saves it to the table's local directory.
*   `GET /api/stream_step?theta={val}&rho={val}`: Accepts discrete coordinates and relays them via UART/Serial to the motor drivers.

## Roadmap & Future Enhancements
* Implementation of the native browser Web Serial API for direct USB-to-Controller communication, bypassing the need for a backend network relay.
* Stream acknowledgment (ACK) handshakes to prevent the buffer from out-pacing the physical stepper motors.
* Splitting the codebase into modular ES6 JavaScript files for easier maintenance.
