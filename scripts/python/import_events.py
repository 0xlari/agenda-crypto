import csv
import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client


def parse_bool(value: str) -> bool:
    return str(value).strip().lower() == "true"


def parse_tags(value: str) -> list[str]:
    if not value:
        return []
    return [tag.strip() for tag in value.split(",") if tag.strip()]


def main() -> None:
    project_root = Path(__file__).resolve().parents[2]
    env_path = project_root / ".env.local"
    csv_path = project_root / "scripts" / "python" / "sample_events.csv"

    load_dotenv(env_path)

    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        raise ValueError("Variáveis do Supabase não encontradas no .env.local")

    supabase: Client = create_client(supabase_url, supabase_key)

    events_to_insert = []

    with open(csv_path, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            event = {
                "title": row["title"],
                "slug": row["slug"],
                "short_description": row["short_description"],
                "description": row["description"],
                "city": row["city"],
                "country": row["country"] or "Brazil",
                "venue": row["venue"],
                "is_online": parse_bool(row["is_online"]),
                "start_date": row["start_date"],
                "end_date": row["end_date"] or None,
                "category": row["category"],
                "audience": row["audience"],
                "tags": parse_tags(row["tags"]),
                "source_url": row["source_url"],
                "registration_url": row["registration_url"],
                "featured": parse_bool(row["featured"]),
                "published": parse_bool(row["published"]),
            }
            events_to_insert.append(event)

    if not events_to_insert:
        print("Nenhum evento encontrado no CSV.")
        return

    response = supabase.table("events").insert(events_to_insert).execute()
    print("Importação concluída.")
    print(response)


if __name__ == "__main__":
    main()