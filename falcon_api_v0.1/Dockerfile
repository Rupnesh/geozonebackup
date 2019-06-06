FROM python:3.6-alpine
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . ./
ENTRYPOINT ["python"]
CMD ["falcon-api.py"]
