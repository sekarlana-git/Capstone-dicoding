import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Status } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "secret");

    const userId = payload;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload: no userId" },
        { status: 401 }
      );
    }

    const [user, analyses] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: Number(userId) },
      }),
      prisma.analisa.findMany({
        where: { userId: Number(userId) },
      }),
    ]);

    return NextResponse.json({ user, analyses });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized or invalid token" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { age, gender, height, weight, name } = body;
  console.log({ age, gender, height, weight, name });

const req = await fetch(
  "https://web-production-b0bea.up.railway.app/predict",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        umur: age,
        tinggi: height,
        jenis_kelamin: gender,
      }),
    }
  );

  const res = await req.json();
  console.log("RAILWAY RESPONSE:", res);
  console.log({ res });
  const analyst = res?.status_gizi;

if (!analyst || !recommendations[analyst]) {
  return NextResponse.json(
    { error: "Prediction API failed" },
    { status: 400 }
  );
}

  const recommendations: {
    [key: string]: string[];
  } = {
    normal: [
      "Pertahankan pola makan sehat dan seimbang",
      "Lanjutkan pemantauan pertumbuhan secara berkala",
      "Pastikan anak cukup istirahat dan aktivitas fisik",
    ],
    stunting: [
      "Tingkatkan asupan protein hewani dan nabati",
      "Konsultasikan dengan tenaga medis atau gizi",
      "Pantau tinggi dan berat badan setiap bulan",
    ],
    tinggi: [
      "Pastikan asupan kalsium dan vitamin D cukup",
      "Lanjutkan aktivitas fisik yang mendukung postur",
      "Berikan nutrisi seimbang agar pertumbuhan proporsional",
    ],
    "severely stunting": [
      "Segera konsultasikan dengan dokter anak atau ahli gizi",
      "Berikan makanan tinggi energi dan zat gizi mikro (zat besi, zink, vitamin A)",
      "Evaluasi kondisi medis yang mendasari secara menyeluruh",
      "Ikuti program pemulihan gizi (jika tersedia di daerahmu)",
    ],
  };
  console.log(recommendations[analyst]);

  if (!analyst) {
    return NextResponse.json(
      { error: "Data tidak valid atau kosong" },
      { status: 401 }
    );
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  console.log(token);

  if (token == "guest") {
    return NextResponse.json({
      status: analyst,
      rekomendasi: recommendations[analyst],
    });
  }

  if (typeof token !== "string") {
    return NextResponse.json(
      { error: "Invalid token payload" },
      { status: 401 }
    );
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET ?? "secret");

  const userId = payload;
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid token payload: no userId" },
      { status: 401 }
    );
  }

  await prisma.analisa.create({
    data: {
      weight,
      gender,
      name,
      age,
      status: analyst.split(" ").join("_") as Status,
      height,
      analysisDate: new Date(),
      user: {
        connect: { id: Number(userId) },
      },
    },
  });

  return NextResponse.json({
    status: analyst,
    rekomendasi: recommendations[analyst],
    debug: "test",
  });
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "secret");

    const userId = payload;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid token payload: no userId" },
        { status: 401 }
      );
    }

    await prisma.analisa.delete({
      where: {
        id: body.id,
      },
    });

    const [user, analyses] = await prisma.$transaction([
      prisma.user.findUnique({
        where: { id: Number(userId) },
      }),
      prisma.analisa.findMany({
        where: { userId: Number(userId) },
      }),
    ]);

    return NextResponse.json({ user, analyses });
  } catch (error) {
    return NextResponse.json(
      { error: "Unauthorized or invalid token" },
      { status: 401 }
    );
  }
}
