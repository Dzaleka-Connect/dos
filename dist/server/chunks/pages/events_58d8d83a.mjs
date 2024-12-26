import { google } from 'googleapis';
import { v2 } from 'cloudinary';

const initializeAuth = () => {
  const clientEmail = "dzaleka-online-services@sixth-now-440314-a7.iam.gserviceaccount.com";
  const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDV6YQiuSpiWDwL\nmj7ySRIgZi9PUaYcyzrT5dP8/qJr1IQaZfoyUqoJbd/lV9RyEDZnzdWezknvC2qK\nayMXjSCmJPN25md/Vz90LvhOVDKyIHzSFS6O64tqfkEOsQoJvzv/SexwICqbDiiP\nBbcsOPFB12vFliL4ArNsA6fP6HNjvFlELco2cP003XAGOa0x3uvS6QhVMfL930rL\ngk2g1gbDIusI562kI6tWVV/H7Xh08OQBHA6IWDaiWUH4eMGcRtK+Dq3LqXasmFgH\nzRdcy7Zywx+Uz0nnGS6Qsy/aVrSB88sHP4OLqYDJ+/Dfsd/jKwCkJxYeW65CoIYL\n+88OEvBDAgMBAAECggEAaaLD6hHe6GoCXQhzBVsoZG+R9W2wxo9mIbZhlZJ5yx5L\njm3FvIwuBDIKW0ugUiPHekOftqjQwge1OV3nGn5LHUEqKhFmEvCXGV0IqkXSMzzv\n5x8mutV/J7vpjMPI3T9e9Zcf988qux+mz9pWtrP4EDe9tPmLk0ZiLHkxqe507U7y\n9P0/j9TkN0ryZXScWgfThxxJxC5w5SUWghe3X4k6IQCNSJGdhuzxRMFG9qwKfL7q\n3usKCuZNTA9jhVt+72+npsiKL+5C+AnDcZtCSCHow1Dg9bPya/IxTyY3oHo5Z9FQ\nRfp5b4RMI8NcAXq4Lsgx1qBoqJUrqKn81vsw+F2Y4QKBgQDrRufDG8dUH2C2RNPv\nPljb/ifT1dX0X3swMTJyl1LADTgV0Mv3dwpQjIxvOuszTowYy5D3nUXRcO1tO0Ou\nq8oBjBjBgrYPdOu1/FLbwQ3nWuLDB3X3L5/PfEjShldxhhpDdjQIuh+8sHK61jBp\nPxiNnSiWUoMCu5ybfSEiUIO5TwKBgQDowN74uyNAw9zFhbtouT3AfHLbdWQeGpgn\nlOpfzg5qioyXMhr3op9ZUcEADguIEANYZ4UBzIlULwLaPRKdmEEmsvSubMOKWfdn\nEptUSt4rcOYN+Cigxg4qMtNK9J6F4u1uMmM47ZbWCglKwTfa/czmRRX7V87Dx+Vn\nPnTbefS0zQKBgQDllVAs3Jt6ZBAMbEdeyrkNGwokNSLNjqp30VoH5c/y5jNXXmLa\nPQgMp8mV9Kl0bG5a97GjXo21nXuhvlYCSVIahmnV0sXzeUVVVT5JgC4gF1j1tP8Q\n0SEh54ZsIHmNpq1ULTEDXxP/HTMnTED7Qn2kGrpzTVrYPNjKBaVihay0EwKBgB/F\nhCpL0Uob8lz8HlLzRlyqIDuY0KvTUYXFrCCbzhf5Bav16Px4tGvK3x+UyzothWdh\n6iQOuYhGSotj3tCoYexYbVIKAr81/LGTNqTQ+3bOmHi7sUARCQn1miYXMjRwf5yV\nQDobJIXfJNmReoBoOLoOICwJFm5fMQ9g1S7IfQDZAoGALDivdAZMcFKi2+CsMYeO\nw22A6QYQJ+zmQ8hCu/lpety6YbPnX1Xkm9JzX3lTuDLjeE24jiOj8Azd5StPe7pG\nnOKmdIeDFTMZpmSuVGxNy2UhidG7WCWM6L03exwRZq2rc1wpu8YaV94SiS5P88Xv\nIGUH4b6NBkyeLUIRFUdlgrg=\n-----END PRIVATE KEY-----\n";
  try {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
        type: "service_account",
        project_id: "sixth-now-440314"
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });
  } catch (error) {
    console.error("Error initializing Google Auth:", error);
    throw error;
  }
};
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1e3;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let auth;
let sheets;
let spreadsheetId;
try {
  auth = initializeAuth();
  sheets = google.sheets({ version: "v4", auth });
  spreadsheetId = "1qS-Cx2Vkc-PIV3xobnQNNUgFaNGVulsqjrn9IrlO2Z0";
  console.log("Successfully initialized Google Sheets");
} catch (error) {
  console.error("Failed to initialize Google Sheets:", error);
}
async function retryOperation(operation, retryCount = 0) {
  try {
    return await operation();
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      console.error(`Failed after ${MAX_RETRIES} retries:`, error);
      throw error;
    }
    if (error.code === 429 || error.message?.includes("resource_exhausted")) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Rate limited, retrying in ${delay}ms...`);
      await wait(delay);
      return retryOperation(operation, retryCount + 1);
    }
    throw error;
  }
}
async function appendToSheet(values) {
  if (!sheets || !spreadsheetId) {
    console.error("Google Sheets not properly initialized");
    return null;
  }
  try {
    return await retryOperation(async () => {
      console.log("Attempting to append to sheet:", spreadsheetId);
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Events!A:K",
        // Adjust range based on your columns
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [values]
        }
      });
      console.log("Successfully appended to sheet");
      return response.data;
    });
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return null;
  }
}

v2.config({
  cloud_name: "dcvwslmow",
  api_key: "273488418491478",
  api_secret: "stRzIpX1txxXtGo7lKGdL6d_nac"
});
async function uploadToCloudinary(file) {
  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataURI = `data:${file.type};base64,${base64}`;
    const result = await v2.uploader.upload(dataURI, {
      folder: "dzaleka-events",
      resource_type: "auto"
    });
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}

const prerender = false;
const POST = async ({ request }) => {
  try {
    console.log("Received event submission request");
    console.log("Request headers:", Object.fromEntries(request.headers.entries()));
    const contentType = request.headers.get("content-type") || "";
    console.log("Raw Content-Type:", contentType);
    if (!contentType.includes("multipart/form-data")) {
      console.error("Invalid content type:", contentType);
      return new Response(JSON.stringify({
        message: "Invalid content type. Must be multipart/form-data",
        receivedContentType: contentType
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    console.log("Parsing form data...");
    const formData = await request.formData();
    console.log("Form data received");
    console.log("Form fields received:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, "(File):", value.name, value.type, value.size + " bytes");
      } else {
        console.log(key, ":", value);
      }
    }
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const date = formData.get("date");
    const location = formData.get("location");
    const capacity = formData.get("capacity") ? parseInt(formData.get("capacity")) : "";
    const organizerName = formData.get("organizerName");
    const organizerEmail = formData.get("organizerEmail");
    const organizerPhone = formData.get("organizerPhone") || "";
    const createdAt = (/* @__PURE__ */ new Date()).toISOString();
    console.log("Extracted form data:", {
      title,
      category,
      date,
      location,
      capacity,
      organizerName,
      organizerEmail
    });
    if (!title || !description || !category || !date || !location || !organizerName || !organizerEmail) {
      console.error("Missing required fields");
      return new Response(JSON.stringify({
        message: "Missing required fields",
        receivedData: {
          hasTitle: !!title,
          hasDescription: !!description,
          hasCategory: !!category,
          hasDate: !!date,
          hasLocation: !!location,
          hasOrganizerName: !!organizerName,
          hasOrganizerEmail: !!organizerEmail
        }
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    let imageUrl = "";
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      console.log("Processing image upload:", imageFile.name, imageFile.type, imageFile.size + " bytes");
      try {
        const result2 = await uploadToCloudinary(imageFile);
        imageUrl = result2.secure_url;
        console.log("Image uploaded successfully:", imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("No image file provided or empty file");
    }
    const eventData = [
      title,
      description,
      category,
      date,
      location,
      capacity,
      organizerName,
      organizerEmail,
      organizerPhone,
      imageUrl,
      createdAt
    ];
    console.log("Attempting to save to Google Sheets");
    const result = await appendToSheet(eventData);
    if (!result) {
      console.error("Failed to save to Google Sheets");
      return new Response(JSON.stringify({
        message: "Failed to save event data to Google Sheets, but event was processed",
        event: {
          title,
          description,
          category,
          date,
          location,
          capacity,
          organizerName,
          organizerEmail,
          organizerPhone,
          imageUrl,
          createdAt
        }
      }), {
        status: 207,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    console.log("Event submitted successfully");
    return new Response(JSON.stringify({
      message: "Event submitted successfully",
      event: {
        title,
        description,
        category,
        date,
        location,
        capacity,
        organizerName,
        organizerEmail,
        organizerPhone,
        imageUrl,
        createdAt
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing event submission:", error);
    return new Response(JSON.stringify({
      message: "Error processing event submission",
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};

export { POST, prerender };
