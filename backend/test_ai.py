from app.ai_interpreter import extract_text_evidence


result = extract_text_evidence(
    description="Mașina nu mai trage când accelerez și se aude un șuierat.",
    language="ro",
)

print(result)