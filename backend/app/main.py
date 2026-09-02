from fastapi import FastAPI

app = FastAPI(
    title="AutoDiagnose AI API",
    version="0.1.0"
)


@app.get("/")
def read_root():
    return {
        "message": "AutoDiagnose AI API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }