import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return <Card className="w-full px-4 py-5">
    <CardContent className="gap-4 p-2 h-[calc(100vh-160px)]">
        <h1 className="text-2xl">Semangat pagi!</h1>
        <div className="pt-2 text-gray-600">
          Selamat datang di Qubu Resort Satellite Apps.
        </div>
    </CardContent>
  </Card>
}