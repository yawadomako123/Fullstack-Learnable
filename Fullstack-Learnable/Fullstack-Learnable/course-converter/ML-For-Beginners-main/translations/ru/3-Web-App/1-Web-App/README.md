# Создание веб-приложения для использования ML модели

В этом уроке вы обучите ML модель на наборе данных, который просто невероятен: _наблюдения НЛО за последний век_, собранные из базы данных NUFORC.

Вы узнаете:

- Как "заквасить" обученную модель
- Как использовать эту модель в приложении Flask

Мы продолжим использовать ноутбуки для очистки данных и обучения нашей модели, но вы можете сделать шаг вперед, исследуя использование модели "в дикой природе", так сказать: в веб-приложении.

Для этого вам нужно создать веб-приложение с использованием Flask.

## [Предварительный опрос](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/17/)

## Создание приложения

Существует несколько способов создания веб-приложений для работы с моделями машинного обучения. Ваша веб-архитектура может повлиять на то, как ваша модель будет обучена. Представьте, что вы работаете в компании, где группа специалистов по данным обучила модель, которую они хотят, чтобы вы использовали в приложении.

### Условия

Существует множество вопросов, которые вам нужно задать:

- **Это веб-приложение или мобильное приложение?** Если вы создаете мобильное приложение или вам нужно использовать модель в контексте IoT, вы можете использовать [TensorFlow Lite](https://www.tensorflow.org/lite/) и использовать модель в приложении Android или iOS.
- **Где будет находиться модель?** В облаке или локально?
- **Поддержка оффлайн.** Должно ли приложение работать в оффлайн-режиме?
- **Какая технология использовалась для обучения модели?** Выбранная технология может повлиять на инструменты, которые вам нужно использовать.
    - **Использование TensorFlow.** Если вы обучаете модель с помощью TensorFlow, например, эта экосистема предоставляет возможность конвертировать модель TensorFlow для использования в веб-приложении с помощью [TensorFlow.js](https://www.tensorflow.org/js/).
    - **Использование PyTorch.** Если вы создаете модель с использованием библиотеки, такой как [PyTorch](https://pytorch.org/), у вас есть возможность экспортировать ее в формате [ONNX](https://onnx.ai/) (Open Neural Network Exchange) для использования в JavaScript веб-приложениях, которые могут использовать [Onnx Runtime](https://www.onnxruntime.ai/). Эта опция будет рассмотрена в будущем уроке для модели, обученной с помощью Scikit-learn.
    - **Использование Lobe.ai или Azure Custom Vision.** Если вы используете систему ML SaaS (Программное обеспечение как услуга), такую как [Lobe.ai](https://lobe.ai/) или [Azure Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/?WT.mc_id=academic-77952-leestott) для обучения модели, это программное обеспечение предоставляет способы экспорта модели для многих платформ, включая создание индивидуального API, который можно запрашивать в облаке вашим онлайн-приложением.

У вас также есть возможность создать целое веб-приложение Flask, которое будет способно обучать модель прямо в веб-браузере. Это также можно сделать с помощью TensorFlow.js в контексте JavaScript.

Для наших целей, поскольку мы работали с ноутбуками на Python, давайте рассмотрим шаги, которые вам нужно предпринять, чтобы экспортировать обученную модель из такого ноутбука в формат, читаемый веб-приложением на Python.

## Инструменты

Для этой задачи вам понадобятся два инструмента: Flask и Pickle, оба из которых работают на Python.

✅ Что такое [Flask](https://palletsprojects.com/p/flask/)? Определяемый его создателями как "микрофреймворк", Flask предоставляет основные функции веб-фреймворков с использованием Python и движка шаблонов для создания веб-страниц. Ознакомьтесь с [этим учебным модулем](https://docs.microsoft.com/learn/modules/python-flask-build-ai-web-app?WT.mc_id=academic-77952-leestott), чтобы попрактиковаться в создании приложений с помощью Flask.

✅ Что такое [Pickle](https://docs.python.org/3/library/pickle.html)? Pickle 🥒 — это модуль Python, который сериализует и десериализует структуру объекта Python. Когда вы "заквашиваете" модель, вы сериализуете или упрощаете ее структуру для использования в вебе. Будьте осторожны: pickle не является intrinsically безопасным, поэтому будьте осторожны, если вас попросят "распаковать" файл. У файла, созданного с помощью pickle, есть суффикс `.pkl`.

## Упражнение - очистите ваши данные

В этом уроке вы будете использовать данные о 80,000 наблюдениях НЛО, собранных [NUFORC](https://nuforc.org) (Национальным центром отчетности по НЛО). Эти данные содержат интересные описания наблюдений НЛО, например:

- **Длинное примерное описание.** "Человек выходит из луча света, который светит на травяное поле ночью, и бежит к парковке Texas Instruments".
- **Короткое примерное описание.** "огни преследовали нас".

Электронная таблица [ufos.csv](../../../../3-Web-App/1-Web-App/data/ufos.csv) включает столбцы о `city`, `state` и `country`, где произошло наблюдение, `shape` объекта и его `latitude` и `longitude`.

В пустом [ноутбуке](../../../../3-Web-App/1-Web-App/notebook.ipynb), включенном в этот урок:

1. импортируйте `pandas`, `matplotlib` и `numpy`, как вы делали в предыдущих уроках, и импортируйте таблицу ufos. Вы можете взглянуть на образец набора данных:

    ```python
    import pandas as pd
    import numpy as np
    
    ufos = pd.read_csv('./data/ufos.csv')
    ufos.head()
    ```

1. Преобразуйте данные ufos в небольшой dataframe с новыми заголовками. Проверьте уникальные значения в поле `Country`.

    ```python
    ufos = pd.DataFrame({'Seconds': ufos['duration (seconds)'], 'Country': ufos['country'],'Latitude': ufos['latitude'],'Longitude': ufos['longitude']})
    
    ufos.Country.unique()
    ```

1. Теперь вы можете уменьшить объем данных, с которыми нам нужно работать, удалив любые нулевые значения и импортировав только наблюдения от 1 до 60 секунд:

    ```python
    ufos.dropna(inplace=True)
    
    ufos = ufos[(ufos['Seconds'] >= 1) & (ufos['Seconds'] <= 60)]
    
    ufos.info()
    ```

1. Импортируйте библиотеку `LabelEncoder` из Scikit-learn, чтобы преобразовать текстовые значения для стран в числа:

    ✅ LabelEncoder кодирует данные в алфавитном порядке

    ```python
    from sklearn.preprocessing import LabelEncoder
    
    ufos['Country'] = LabelEncoder().fit_transform(ufos['Country'])
    
    ufos.head()
    ```

    Ваши данные должны выглядеть так:

    ```output
    	Seconds	Country	Latitude	Longitude
    2	20.0	3		53.200000	-2.916667
    3	20.0	4		28.978333	-96.645833
    14	30.0	4		35.823889	-80.253611
    23	60.0	4		45.582778	-122.352222
    24	3.0		3		51.783333	-0.783333
    ```

## Упражнение - создайте вашу модель

Теперь вы можете подготовиться к обучению модели, разделив данные на обучающую и тестовую группы.

1. Выберите три признака, которые вы хотите использовать для обучения в качестве вашего вектора X, а вектор y будет `Country`. You want to be able to input `Seconds`, `Latitude` and `Longitude`, и получите идентификатор страны для возврата.

    ```python
    from sklearn.model_selection import train_test_split
    
    Selected_features = ['Seconds','Latitude','Longitude']
    
    X = ufos[Selected_features]
    y = ufos['Country']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    ```

1. Обучите вашу модель, используя логистическую регрессию:

    ```python
    from sklearn.metrics import accuracy_score, classification_report
    from sklearn.linear_model import LogisticRegression
    model = LogisticRegression()
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    
    print(classification_report(y_test, predictions))
    print('Predicted labels: ', predictions)
    print('Accuracy: ', accuracy_score(y_test, predictions))
    ```

Точность неплохая **(около 95%)**, как и следовало ожидать, поскольку `Country` and `Latitude/Longitude` correlate.

The model you created isn't very revolutionary as you should be able to infer a `Country` from its `Latitude` and `Longitude`, но это хорошее упражнение, чтобы попытаться обучить модель на очищенных, экспортированных данных, а затем использовать эту модель в веб-приложении.

## Упражнение - "заквасите" вашу модель

Теперь пришло время _заквасить_ вашу модель! Вы можете сделать это всего за несколько строк кода. Как только она будет _заквашена_, загрузите вашу заквашенную модель и протестируйте ее на образце массива данных, содержащем значения для секунд, широты и долготы,

```python
import pickle
model_filename = 'ufo-model.pkl'
pickle.dump(model, open(model_filename,'wb'))

model = pickle.load(open('ufo-model.pkl','rb'))
print(model.predict([[50,44,-12]]))
```

Модель возвращает **'3'**, что является кодом страны для Великобритании. Дико! 👽

## Упражнение - создайте приложение Flask

Теперь вы можете создать приложение Flask, чтобы вызвать вашу модель и вернуть аналогичные результаты, но в более визуально привлекательном виде.

1. Начните с создания папки **web-app** рядом с файлом _notebook.ipynb_, где находится ваш файл _ufo-model.pkl_.

1. В этой папке создайте еще три папки: **static**, с папкой **css** внутри, и **templates**. Теперь у вас должны быть следующие файлы и каталоги:

    ```output
    web-app/
      static/
        css/
      templates/
    notebook.ipynb
    ufo-model.pkl
    ```

    ✅ Обратитесь к папке с решением, чтобы увидеть готовое приложение

1. Первый файл, который нужно создать в папке _web-app_, это файл **requirements.txt**. Как _package.json_ в приложении JavaScript, этот файл перечисляет зависимости, необходимые приложению. В **requirements.txt** добавьте строки:

    ```text
    scikit-learn
    pandas
    numpy
    flask
    ```

1. Теперь запустите этот файл, перейдя в _web-app_:

    ```bash
    cd web-app
    ```

1. В вашем терминале введите `pip install`, чтобы установить библиотеки, перечисленные в _requirements.txt_:

    ```bash
    pip install -r requirements.txt
    ```

1. Теперь вы готовы создать еще три файла, чтобы завершить приложение:

    1. Создайте **app.py** в корне.
    2. Создайте **index.html** в каталоге _templates_.
    3. Создайте **styles.css** в каталоге _static/css_.

1. Заполните файл _styles.css_ несколькими стилями:

    ```css
    body {
    	width: 100%;
    	height: 100%;
    	font-family: 'Helvetica';
    	background: black;
    	color: #fff;
    	text-align: center;
    	letter-spacing: 1.4px;
    	font-size: 30px;
    }
    
    input {
    	min-width: 150px;
    }
    
    .grid {
    	width: 300px;
    	border: 1px solid #2d2d2d;
    	display: grid;
    	justify-content: center;
    	margin: 20px auto;
    }
    
    .box {
    	color: #fff;
    	background: #2d2d2d;
    	padding: 12px;
    	display: inline-block;
    }
    ```

1. Далее заполните файл _index.html_:

    ```html
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>🛸 UFO Appearance Prediction! 👽</title>
        <link rel="stylesheet" href="{{ url_for('static', filename='css/styles.css') }}">
      </head>
    
      <body>
        <div class="grid">
    
          <div class="box">
    
            <p>According to the number of seconds, latitude and longitude, which country is likely to have reported seeing a UFO?</p>
    
            <form action="{{ url_for('predict')}}" method="post">
              <input type="number" name="seconds" placeholder="Seconds" required="required" min="0" max="60" />
              <input type="text" name="latitude" placeholder="Latitude" required="required" />
              <input type="text" name="longitude" placeholder="Longitude" required="required" />
              <button type="submit" class="btn">Predict country where the UFO is seen</button>
            </form>
    
            <p>{{ prediction_text }}</p>
    
          </div>
    
        </div>
    
      </body>
    </html>
    ```

    Обратите внимание на шаблонизирование в этом файле. Заметьте синтаксис "мустанг" вокруг переменных, которые будут предоставлены приложением, таких как текст предсказания: `{{}}`. There's also a form that posts a prediction to the `/predict` route.

    Finally, you're ready to build the python file that drives the consumption of the model and the display of predictions:

1. In `app.py` добавьте:

    ```python
    import numpy as np
    from flask import Flask, request, render_template
    import pickle
    
    app = Flask(__name__)
    
    model = pickle.load(open("./ufo-model.pkl", "rb"))
    
    
    @app.route("/")
    def home():
        return render_template("index.html")
    
    
    @app.route("/predict", methods=["POST"])
    def predict():
    
        int_features = [int(x) for x in request.form.values()]
        final_features = [np.array(int_features)]
        prediction = model.predict(final_features)
    
        output = prediction[0]
    
        countries = ["Australia", "Canada", "Germany", "UK", "US"]
    
        return render_template(
            "index.html", prediction_text="Likely country: {}".format(countries[output])
        )
    
    
    if __name__ == "__main__":
        app.run(debug=True)
    ```

    > 💡 Подсказка: когда вы добавляете [`debug=True`](https://www.askpython.com/python-modules/flask/flask-debug-mode) while running the web app using Flask, any changes you make to your application will be reflected immediately without the need to restart the server. Beware! Don't enable this mode in a production app.

If you run `python app.py` or `python3 app.py` - your web server starts up, locally, and you can fill out a short form to get an answer to your burning question about where UFOs have been sighted!

Before doing that, take a look at the parts of `app.py`:

1. First, dependencies are loaded and the app starts.
1. Then, the model is imported.
1. Then, index.html is rendered on the home route.

On the `/predict` route, several things happen when the form is posted:

1. The form variables are gathered and converted to a numpy array. They are then sent to the model and a prediction is returned.
2. The Countries that we want displayed are re-rendered as readable text from their predicted country code, and that value is sent back to index.html to be rendered in the template.

Using a model this way, with Flask and a pickled model, is relatively straightforward. The hardest thing is to understand what shape the data is that must be sent to the model to get a prediction. That all depends on how the model was trained. This one has three data points to be input in order to get a prediction.

In a professional setting, you can see how good communication is necessary between the folks who train the model and those who consume it in a web or mobile app. In our case, it's only one person, you!

---

## 🚀 Challenge

Instead of working in a notebook and importing the model to the Flask app, you could train the model right within the Flask app! Try converting your Python code in the notebook, perhaps after your data is cleaned, to train the model from within the app on a route called `train`. Каковы плюсы и минусы использования этого метода?

## [Пост-лекционный опрос](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/18/)

## Обзор и самостоятельное изучение

Существует множество способов создания веб-приложения для работы с ML моделями. Составьте список способов, с помощью которых вы можете использовать JavaScript или Python для создания веб-приложения, чтобы использовать машинное обучение. Рассмотрите архитектуру: должна ли модель оставаться в приложении или находиться в облаке? Если последнее, то как бы вы к ней обращались? Нарисуйте архитектурную модель для прикладного ML веб-решения.

## Задание

[Попробуйте другую модель](assignment.md)

**Отказ от ответственности**:  
Этот документ был переведен с использованием услуг машинного перевода на основе ИИ. Хотя мы стремимся к точности, пожалуйста, имейте в виду, что автоматические переводы могут содержать ошибки или неточности. Оригинальный документ на родном языке должен считаться авторитетным источником. Для критически важной информации рекомендуется профессиональный человеческий перевод. Мы не несем ответственности за любые недоразумения или неправильные толкования, возникающие в результате использования этого перевода.