import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface EmployeeCardProps {
  name: string;
  rank: string;
  photo: string;
  department: string;
}

export function EmployeeCard({ name, rank, photo, department }: EmployeeCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1">{name}</h3>
        <Badge variant="secondary" className="mb-2">{rank}</Badge>
        <p className="text-sm text-muted-foreground">{department}</p>
      </CardContent>
    </Card>
  );
}
