import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from config.config import credentials
from logger import logger


class SenderMail:
    def __init__(
        self,
        from_addr: str = credentials.get("username"),
        host: str = credentials.get("host"),
        port: int = credentials.get("port"),
        password: str = credentials.get("password"),
    ):
        self.from_addr = from_addr
        self.host = host
        self.port = port
        self.password = password

    def send(
        self, to_addr: str, content: str, subject: str = "Nokia informa!"
    ):
        """Envia um email atraves do protocolo SMTP com smtplib.

        Args:
            to_addr (str): endereço para qual iremos enviar o email.
            content (str): mensagem/texto do email.
            subject (str, optional): Assunto do email. Defaults to "Nokia informa!".

        Returns:
            bool: True se o email foi enviado corretamente e False caso contrario.
        """
        message = MIMEMultipart()
        message["From"] = self.from_addr
        message["Subject"] = subject
        message["To"] = to_addr

        message_text = MIMEText(content, "HTML")

        message.attach(message_text)
        return self.__send(to_addr, message)

    def __send(self, to_addr: str, message: MIMEMultipart):
        """Encapsula o envio atraves do smtplib.

        Args:
            to_addr (str): endereço para qual iremos enviar o email.
            message (MIMEMultipart): email/mensagem do tipo MIMEMultipart.

        Returns:
            bool: True se enviou e False caso contrario.
        """
        try:
            logger.info("[DEBUG] Enviando email...")
            with smtplib.SMTP(self.host, self.port) as smtp:
                smtp.ehlo()
                smtp.starttls()
                logger.debug("[DEBUG] Conectado ao servidor SMTP")
                smtp.login(self.from_addr, self.password)
                logger.debug("[DEBUG] Login realizado com sucesso")
                smtp.sendmail(self.from_addr, to_addr, message.as_string())
                logger.info("[DEBUG] Email envidado com sucesso")
        except Exception as e:
            logger.error("[ERROR] Falha ao enviar email")
            logger.error(str(e))
            return False
        return True
