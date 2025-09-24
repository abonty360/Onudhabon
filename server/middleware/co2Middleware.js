import { co2 } from "@tgwf/co2";

// Initialize CO₂ model (Sustainable Web Design model)
const co2Emission = new co2({ model: "swd" });

export function co2Middleware(req, res, next) {
    let requestBytes = 0;
    let responseBytes = 0;
    const originalWrite = res.write;
    const originalEnd = res.end;

    if (!req.is("multipart/form-data")) {
        if (req.body) {
            try {
                requestBytes += Buffer.byteLength(JSON.stringify(req.body), "utf8");
            } catch (e) {
                // ignore if body can't be stringified
            }
        }
        if (req.query) {
            requestBytes += Buffer.byteLength(JSON.stringify(req.query), "utf8");
        }
        if (req.headers) {
            requestBytes += Buffer.byteLength(JSON.stringify(req.headers), "utf8");
        }
    }


    res.write = function (chunk, ...args) {
        if (chunk) {
            responseBytes += Buffer.byteLength(chunk, "utf8");
        }
        return originalWrite.apply(res, [chunk, ...args]);
    };

    res.end = function (chunk, ...args) {
        if (chunk) {
            responseBytes += Buffer.byteLength(chunk, "utf8");
        }

        const bytes = requestBytes + responseBytes;
        if (!req.session.totalBytes) {
            req.session.totalBytes = 0;
            req.session.totalEmissions = 0;
        }

        req.session.totalBytes += bytes;

        const greenHost = false;
        const emissions = co2Emission.perByte(bytes, greenHost);
        req.session.totalEmissions += emissions;

        console.log(
            `Session ${req.session.id} transferred ${bytes} bytes, +${emissions} g CO₂`
        );


        return originalEnd.apply(res, [chunk, ...args]);
    };

    next();
}

