import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Result, Root, Info, PersonRoot } from "@/types";
import Filter from "@/components/Filter";

// All Dead Alive
// All location

const fetchChars = async (charList: string[]) => {
  const data = await Promise.all(
    charList.map(async (char) => {
      const response = await fetch(char);
      const data = await response.json();
      return data;
    })
  );

  return data;
};

// Search params to go
const getData = async (location?: string) => {
  let baseUrl = "https://rickandmortyapi.com/api/location";

  const response = await fetch(baseUrl);
  const data = await response.json();
  const locations = data.results.map((res: any) => res.name);
  let chars = [];
  if (!location) {
    console.log("2");
    chars = await data.results[0].residents;
    const characters = await fetchChars(chars);

    return { locations, characters };
  } else {
    console.log("1");
    chars = await data.results.find((res: Result) => location === res.name)
      .residents;
    const characters = await fetchChars(chars);
    return { locations, characters };
  }
};

export default async function Home({
  searchParams,
}: {
  searchParams: { status: string; location: string };
}) {
  const { locations, characters } = await getData(searchParams.location);
  console.log("chars", characters);
  if (!searchParams.location) {
  }

  const statusColors = {
    Alive: "bg-green-800",
    Dead: "bg-red-900",
    unknown: "bg-gray-600",
  };
  return (
    <main className="flex min-h-screen flex-col gap-4 p-24 bg-slate-900">
      <Filter locations={locations} searchParams={searchParams} />
      <div className="grid xl:grid-cols-5 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {characters
          .filter((char) => {
            if (searchParams.status) {
              return char.status === searchParams.status;
            } else {
              return char;
            }
          })
          .map((character: PersonRoot) => (
            <Card
              key={character.id}
              className={`${
                statusColors[character.status as keyof typeof statusColors]
              } border-none`}
            >
              <CardContent className="px-4 pt-2 rounded-lg ">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              </CardContent>

              <div className="px-4 pb-2 space-y-2 ">
                <CardTitle className="text-white">{character.name}</CardTitle>
                <div className="flex text-white gapp-2 flex-col items-start">
                  <div className="flex items-center ">{character.status}</div>
                  <div>Species: {character.species}</div>
                  <div>Last Known Location: {character.location.name}</div>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </main>
  );
}
