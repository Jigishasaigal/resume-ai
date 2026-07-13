import fitz


def extract_text_from_pdf(pdf_source):


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