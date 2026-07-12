import fitz


def extract_text_from_pdf(pdf_source):

    # Accepts either a file path (str) or raw PDF bytes. The bytes path
    # is what lets uploads be read straight from memory/DB without ever
    # touching disk — needed since production hosting typically has an
    # ephemeral filesystem.

    try:

        if isinstance(pdf_source, (bytes, bytearray)):

            document = fitz.open(
                stream=pdf_source,
                filetype="pdf"
            )

        else:

            document = fitz.open(pdf_source)

        text = ""

        for page in document:

            text += page.get_text()

        document.close()

        return text.strip()

    except Exception:

        raise ValueError(
            "Invalid or corrupted PDF file."
        )