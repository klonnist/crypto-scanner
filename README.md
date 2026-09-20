# crypto-scanner

OKX üzerindeki USDT paritelerini çift dip (double bottom) + RSI/Fibonacci uyumsuzluğu (divergence)
yapılarına göre periyodik olarak tarayan bir sinyal botu.

- Tarayıcı `.github/workflows/scan.yml` üzerinden **saatte bir** GitHub Actions ile otomatik çalışır.
- Bulunan sinyaller `docs/data/signals.json` dosyasına yazılır ve otomatik commit edilir.
- Sonuçlar [GitHub Pages panelinde](../../) görüntülenir (`docs/` klasörü, `pages.yml` ile deploy edilir).
- Telegram bildirimleri için `TELEGRAM_BOT_TOKEN` ve `TELEGRAM_CHAT_ID` repo secret'ları tanımlanmalıdır
  (Settings → Secrets and variables → Actions). Tanımlanmadığı sürece bot çalışır ama Telegram mesajı
  göndermez, sonuçlar yalnızca panelde görünür.
- OKX genel OHLCV verisi kimlik bilgisi gerektirmez; `OKX_API_KEY` / `OKX_API_SECRET` / `OKX_API_PASSPHRASE`
  opsiyoneldir.

## Yerel çalıştırma

```bash
pip install -r requirements.txt
python okx_double_bottom_divergence_v1.py
```

Kaynak: [mugiatama34/crypto-scanner](https://github.com/mugiatama34/crypto-scanner)
