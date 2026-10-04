#!/usr/bin/env bash
# Pobiera finalne assety Higgsfield (P0.5) do /public. Wymaga dostępu do
# d2ol7oe51mr4n9.cloudfront.net (storage Higgsfield). Uruchom: bash scripts/fetch-assets.sh
set -euo pipefail
cd "$(dirname "$0")/.."
S="https://d2ol7oe51mr4n9.cloudfront.net/user_3FXNGw8f2f1hQm0DlDovEN823AQ"
mkdir -p public/video public/img public/models
get() { echo "→ $2"; curl -fsSL "$S/$1" -o "$2"; }
get 1c6713a5-214e-4cb3-833d-5a93e0e7806e.mp4  public/video/hero.mp4
get bc96ae1b-5216-478e-9cd3-bb4afaa23a8b.mp4  public/video/hero.webm
get 982869f8-2997-41ed-a325-9704cbd3da67.jpg  public/video/hero-poster.jpg
get 4b4455a3-712b-4bee-851b-6b56457180e4.mp4  public/video/hero-mobile.mp4
get dbc11304-2878-419e-a386-4dbc749e8e25.mp4  public/video/hero-mobile.webm
get 0b1f1fda-4318-43f4-886b-42219750f6cd.jpg  public/video/hero-mobile-poster.jpg
get 069fa8f7-db23-4476-9865-d629b03adb1f.webp public/img/ai-network.webp
get 7c2ea824-d873-4156-8322-c4057851e2a9.webp public/img/training.webp
get 87eef449-974d-418f-a0c9-3fe2bb978328.zip  /tmp/x-glb.zip
unzip -o -q /tmp/x-glb.zip -d public/models && rm /tmp/x-glb.zip
ls -la public/video public/img public/models
