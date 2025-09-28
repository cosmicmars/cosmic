from g4f.client import Client

client = Client()

def get_ai_response(user_message):
    """
    Функция для получения ответа от AI на основе пользовательского сообщения
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": user_message}],
            web_search=False
        )
        text = response.choices[0].message.content
        return text
    except Exception as e:
        return f"Извините, произошла ошибка при обработке запроса: {str(e)}"

