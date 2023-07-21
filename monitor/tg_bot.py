import requests

def tel_send_message(token, chat_id, text):
    url = f'https://api.telegram.org/bot%s/sendMessage' % token
    payload = {
                'chat_id': chat_id,
                'text': text
                }

    r = requests.post(url, json=payload)

    return r

def main():
    chat_id = "-891499835"
    token = "6308650676:AAF4IB5uaTZJ-YgVTXUlH3e8k_EBkI8GuCo"

    text = "Sorry, more test for bot"
    tel_send_message(token, chat_id, text)

if __name__ == "__main__":
    main()
