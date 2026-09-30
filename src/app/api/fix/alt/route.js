import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const { imageSrc, pageTitle } = body;

    if (!imageSrc) {
      return NextResponse.json(
        {
          success: false,
          message: "Image source is required.",
        },
        { status: 400 },
      );
    }

    // Temporary mock AI response.
    // Later this will be replaced with a real AI API.
    const altText = pageTitle ? `${pageTitle} related image` : "Website image";

    return NextResponse.json({
      success: true,
      altText,
      mock: true,
    });
  } catch (error) {
    console.error("ALT fix error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate ALT text.",
      },
      { status: 500 },
    );
  }
}
