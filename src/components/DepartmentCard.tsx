import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface DepartmentCardProps {
  title: string;
  description: string;
  logo: string;
}

export function DepartmentCard({ title, description, logo }: DepartmentCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-card/80 rounded-lg flex-shrink-0">
            <img src={logo} alt={`${title} Logo`} className="h-16 w-16 object-contain" />
          </div>
          <CardTitle className="text-lg leading-tight text-card-foreground">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
