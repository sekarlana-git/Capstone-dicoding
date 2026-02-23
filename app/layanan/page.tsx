"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Result } from "@/components/result";

type FormData = {
  name: string;
  age: number;
  gender: "laki-laki" | "perempuan";
  height: number;
  weight: number;
};

type Result = {
  status: "normal" | "stunting" | "tinggi" | "severely stunting";
  rekomendasi: string[];
  isActive: boolean;
};

export default function LayananPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    age: 0,
    gender: "laki-laki",
    height: 0,
    weight: 0,
  });

  const [result, setResult] = useState<Result>({
    isActive: false,
    rekomendasi: [],
    status: "normal",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "age" || name === "height" || name === "weight"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem("token") ?? "guest";

  try {
    const response = await fetch("/api/analyst", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Unauthorized or server error");
    }

    const data = await response.json();

    setResult({
      isActive: true,
      rekomendasi: data.rekomendasi ?? [],
      status: data.status ?? "normal",
    });

  } catch (error) {
    console.error("Failed to submit:", error);
    alert("Silakan login terlebih dahulu.");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-1000">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Pemeriksaan{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              Nutrisi
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Isi formulir di bawah untuk menganalisis status nutrisi anak anda
            dan mendapatkan rekomendasi yang sesuai
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-6xl">
            <Card className="w-full bg-white shadow-xl animate-in fade-in duration-1000">
              <CardHeader className="bg-gradient-to-r from-green-50 to-cyan-50 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-green-400 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Formulir Pemeriksaan Status Gizi
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Lengkapi informasi berikut untuk mendapatkan analisis
                      status gizi anak
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <form className="space-y-8" onSubmit={handleSubmit}>
                  {/* Informasi Umum */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Informasi Umum
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="childName">Nama Lengkap Anak</Label>
                        <Input
                          id="childName"
                          name="name"
                          placeholder="Masukan Nama Lengkap Anak"
                          className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="age">Usia</Label>
                        <Input
                          id="age"
                          name="age"
                          placeholder="Masukan Usia Sekarang"
                          className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthPlace">Tempat Lahir</Label>
                        <Input
                          id="birthPlace"
                          placeholder="Kota Kelahiran"
                          className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Jenis Kelamin</Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              gender: value as "laki-laki" | "perempuan",
                            })
                          }
                        >
                          <SelectTrigger className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                            <SelectValue placeholder="Pilih Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="laki-laki">Laki-laki</SelectItem>
                            <SelectItem value="perempuan">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Data Antropometri */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Data Antropometri
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="weight">Berat Badan (kg)</Label>
                        <Input
                          id="weight"
                          name="weight"
                          placeholder="Contoh: 24.5"
                          className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                          value={formData.weight}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">
                          Tinggi/Panjang Badan (cm)
                        </Label>
                        <Input
                          id="height"
                          name="height"
                          placeholder="Contoh: 69.3"
                          className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                          value={formData.height}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status Ekonomi */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Status Ekonomi
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="income">Penghasilan</Label>
                        <Select>
                          <SelectTrigger className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                            <SelectValue placeholder="Kategori" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rendah">
                              Rendah (&lt; 2 juta)
                            </SelectItem>
                            <SelectItem value="menengah">
                              Menengah (2-5 juta)
                            </SelectItem>
                            <SelectItem value="tinggi">
                              Tinggi (&gt; 5 juta)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="notes">Keterangan</Label>
                        <Input
                          id="notes"
                          placeholder="Catatan tambahan"
                          className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button className="w-full bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-500 rounded-md hover:to-green-500 text-white py-3 text-lg">
                      Analisa Sekarang
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {result.isActive && (
              <div className="mt-8 flex justify-center w-full">
                <Result
                  status={result.status}
                  rekomendasi={result.rekomendasi}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
