# एक वेब ऐप बनाएं जो एमएल मॉडल का उपयोग करती है

इस पाठ में, आप एक डेटा सेट पर एक एमएल मॉडल को प्रशिक्षित करेंगे जो इस दुनिया से बाहर है: _पिछले सदी के यूएफओ देखे जाने_, जो NUFORC के डेटाबेस से लिया गया है।

आप सीखेंगे:

- एक प्रशिक्षित मॉडल को 'pickle' कैसे करें
- उस मॉडल को एक Flask ऐप में कैसे उपयोग करें

हम अपने नोटबुक का उपयोग डेटा को साफ करने और हमारे मॉडल को प्रशिक्षित करने के लिए जारी रखेंगे, लेकिन आप प्रक्रिया को एक कदम आगे ले जा सकते हैं और एक वेब ऐप में एक मॉडल का उपयोग करने की खोज कर सकते हैं।

ऐसा करने के लिए, आपको Flask का उपयोग करके एक वेब ऐप बनाना होगा।

## [Pre-lecture quiz](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/17/)

## एक ऐप बनाना

मशीन लर्निंग मॉडल का उपभोग करने के लिए वेब ऐप बनाने के कई तरीके हैं। आपकी वेब आर्किटेक्चर आपके मॉडल के प्रशिक्षित होने के तरीके को प्रभावित कर सकती है। कल्पना करें कि आप एक व्यवसाय में काम कर रहे हैं जहां डेटा साइंस समूह ने एक मॉडल प्रशिक्षित किया है जिसे वे चाहते हैं कि आप एक ऐप में उपयोग करें।

### विचार

कई प्रश्न हैं जिन्हें आपको पूछना चाहिए:

- **क्या यह एक वेब ऐप है या मोबाइल ऐप?** यदि आप एक मोबाइल ऐप बना रहे हैं या IoT संदर्भ में मॉडल का उपयोग करने की आवश्यकता है, तो आप [TensorFlow Lite](https://www.tensorflow.org/lite/) का उपयोग कर सकते हैं और मॉडल को एक Android या iOS ऐप में उपयोग कर सकते हैं।
- **मॉडल कहाँ रहेगा?** क्लाउड में या स्थानीय रूप से?
- **ऑफलाइन समर्थन।** क्या ऐप को ऑफलाइन काम करना है?
- **मॉडल को प्रशिक्षित करने के लिए कौन सी तकनीक का उपयोग किया गया था?** चुनी गई तकनीक आपके द्वारा उपयोग किए जाने वाले टूलिंग को प्रभावित कर सकती है।
    - **TensorFlow का उपयोग करना।** यदि आप TensorFlow का उपयोग करके एक मॉडल को प्रशिक्षित कर रहे हैं, उदाहरण के लिए, वह इकोसिस्टम एक TensorFlow मॉडल को एक वेब ऐप में उपयोग के लिए परिवर्तित करने की क्षमता प्रदान करता है [TensorFlow.js](https://www.tensorflow.org/js/) का उपयोग करके।
    - **PyTorch का उपयोग करना।** यदि आप एक लाइब्रेरी जैसे [PyTorch](https://pytorch.org/) का उपयोग करके एक मॉडल बना रहे हैं, तो आपके पास इसे [ONNX](https://onnx.ai/) (Open Neural Network Exchange) प्रारूप में निर्यात करने का विकल्प है ताकि इसे जावास्क्रिप्ट वेब ऐप्स में उपयोग किया जा सके जो [Onnx Runtime](https://www.onnxruntime.ai/) का उपयोग कर सकते हैं। इस विकल्प को एक भविष्य के पाठ में एक Scikit-learn प्रशिक्षित मॉडल के लिए खोजा जाएगा।
    - **Lobe.ai या Azure Custom Vision का उपयोग करना।** यदि आप एक एमएल SaaS (Software as a Service) सिस्टम जैसे [Lobe.ai](https://lobe.ai/) या [Azure Custom Vision](https://azure.microsoft.com/services/cognitive-services/custom-vision-service/?WT.mc_id=academic-77952-leestott) का उपयोग करके एक मॉडल को प्रशिक्षित कर रहे हैं, तो इस प्रकार का सॉफ़्टवेयर कई प्लेटफ़ॉर्म के लिए मॉडल को निर्यात करने के तरीके प्रदान करता है, जिसमें आपके ऑनलाइन एप्लिकेशन द्वारा क्लाउड में क्वेरी किए जाने वाले एक विशेष API का निर्माण शामिल है।

आपके पास एक संपूर्ण Flask वेब ऐप बनाने का अवसर भी है जो स्वयं वेब ब्राउज़र में मॉडल को प्रशिक्षित कर सकता है। यह भी TensorFlow.js का उपयोग करके एक जावास्क्रिप्ट संदर्भ में किया जा सकता है।

हमारे उद्देश्यों के लिए, चूंकि हम Python-आधारित नोटबुक के साथ काम कर रहे हैं, आइए उन चरणों का अन्वेषण करें जिन्हें आपको एक प्रशिक्षित मॉडल को ऐसे नोटबुक से Python-निर्मित वेब ऐप द्वारा पढ़े जाने योग्य प्रारूप में निर्यात करने के लिए लेने की आवश्यकता है।

## उपकरण

इस कार्य के लिए, आपको दो उपकरणों की आवश्यकता है: Flask और Pickle, दोनों Python पर चलते हैं।

✅ [Flask](https://palletsprojects.com/p/flask/) क्या है? इसके निर्माताओं द्वारा एक 'माइक्रो-फ्रेमवर्क' के रूप में परिभाषित, Flask Python का उपयोग करके वेब फ्रेमवर्क की बुनियादी विशेषताएं और वेब पेज बनाने के लिए एक टेम्पलेटिंग इंजन प्रदान करता है। Flask के साथ निर्माण का अभ्यास करने के लिए [इस Learn module](https://docs.microsoft.com/learn/modules/python-flask-build-ai-web-app?WT.mc_id=academic-77952-leestott) को देखें।

✅ [Pickle](https://docs.python.org/3/library/pickle.html) क्या है? Pickle 🥒 एक Python मॉड्यूल है जो एक Python ऑब्जेक्ट संरचना को सीरियलाइज़ और डी-सीरियलाइज़ करता है। जब आप एक मॉडल को 'pickle' करते हैं, तो आप उसकी संरचना को वेब पर उपयोग के लिए सीरियलाइज़ या फ्लैटन करते हैं। सावधान रहें: pickle स्वाभाविक रूप से सुरक्षित नहीं है, इसलिए यदि किसी फाइल को 'अन-पिकल' करने के लिए प्रेरित किया जाता है तो सावधान रहें। एक पिकल की गई फाइल का उपसर्ग `.pkl` होता है।

## अभ्यास - अपने डेटा को साफ करें

इस पाठ में आप 80,000 यूएफओ देखे जाने के डेटा का उपयोग करेंगे, जो [NUFORC](https://nuforc.org) (The National UFO Reporting Center) द्वारा एकत्र किया गया है। इस डेटा में यूएफओ देखे जाने के कुछ दिलचस्प विवरण हैं, उदाहरण के लिए:

- **लंबा उदाहरण विवरण।** "एक आदमी रात में एक घास के मैदान पर चमकने वाली रोशनी की एक किरण से उभरता है और वह टेक्सास इंस्ट्रूमेंट्स पार्किंग स्थल की ओर दौड़ता है"।
- **छोटा उदाहरण विवरण।** "रोशनी ने हमारा पीछा किया"।

[ufos.csv](../../../../3-Web-App/1-Web-App/data/ufos.csv) स्प्रेडशीट में `city`, `state` और `country` के बारे में कॉलम शामिल हैं जहां देखे जाने की घटना हुई, वस्तु का `shape` और उसका `latitude` और `longitude`।

इस पाठ में शामिल खाली [notebook](../../../../3-Web-App/1-Web-App/notebook.ipynb) में:

1. `pandas`, `matplotlib`, और `numpy` को आयात करें जैसा कि आपने पिछले पाठों में किया था और ufos स्प्रेडशीट को आयात करें। आप डेटा सेट के एक नमूने को देख सकते हैं:

    ```python
    import pandas as pd
    import numpy as np
    
    ufos = pd.read_csv('./data/ufos.csv')
    ufos.head()
    ```

1. UfOs डेटा को ताजा शीर्षकों के साथ एक छोटे डेटा फ्रेम में परिवर्तित करें। `Country` फ़ील्ड में अद्वितीय मानों की जांच करें।

    ```python
    ufos = pd.DataFrame({'Seconds': ufos['duration (seconds)'], 'Country': ufos['country'],'Latitude': ufos['latitude'],'Longitude': ufos['longitude']})
    
    ufos.Country.unique()
    ```

1. अब, आप उन डेटा की मात्रा को कम कर सकते हैं जिनसे हमें निपटना है, किसी भी null मानों को हटा कर और केवल 1-60 सेकंड के बीच देखे जाने को आयात करके:

    ```python
    ufos.dropna(inplace=True)
    
    ufos = ufos[(ufos['Seconds'] >= 1) & (ufos['Seconds'] <= 60)]
    
    ufos.info()
    ```

1. टेक्स्ट मानों को संख्याओं में बदलने के लिए Scikit-learn की `LabelEncoder` लाइब्रेरी आयात करें:

    ✅ LabelEncoder डेटा को वर्णानुक्रम में एन्कोड करता है

    ```python
    from sklearn.preprocessing import LabelEncoder
    
    ufos['Country'] = LabelEncoder().fit_transform(ufos['Country'])
    
    ufos.head()
    ```

    आपका डेटा इस प्रकार दिखना चाहिए:

    ```output
    	Seconds	Country	Latitude	Longitude
    2	20.0	3		53.200000	-2.916667
    3	20.0	4		28.978333	-96.645833
    14	30.0	4		35.823889	-80.253611
    23	60.0	4		45.582778	-122.352222
    24	3.0		3		51.783333	-0.783333
    ```

## अभ्यास - अपना मॉडल बनाएं

अब आप डेटा को प्रशिक्षण और परीक्षण समूह में विभाजित करके मॉडल को प्रशिक्षित करने के लिए तैयार हो सकते हैं।

1. उन तीन विशेषताओं का चयन करें जिन पर आप प्रशिक्षण देना चाहते हैं, जैसा कि आपके X वेक्टर के लिए, और y वेक्टर `Country`. You want to be able to input `Seconds`, `Latitude` and `Longitude` होगा और एक देश आईडी वापस पाने के लिए।

    ```python
    from sklearn.model_selection import train_test_split
    
    Selected_features = ['Seconds','Latitude','Longitude']
    
    X = ufos[Selected_features]
    y = ufos['Country']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)
    ```

1. अपने मॉडल को लॉजिस्टिक रिग्रेशन का उपयोग करके प्रशिक्षित करें:

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

सटीकता बुरी नहीं है **(लगभग 95%)**, अप्रत्याशित रूप से, जैसा कि `Country` and `Latitude/Longitude` correlate.

The model you created isn't very revolutionary as you should be able to infer a `Country` from its `Latitude` and `Longitude`, लेकिन यह एक अच्छा अभ्यास है कच्चे डेटा से प्रशिक्षित करने का प्रयास करना जिसे आपने साफ किया, निर्यात किया, और फिर इस मॉडल को एक वेब ऐप में उपयोग करें।

## अभ्यास - अपने मॉडल को 'pickle' करें

अब, अपने मॉडल को _pickle_ करने का समय है! आप इसे कुछ लाइनों के कोड में कर सकते हैं। एक बार जब यह _pickled_ हो जाए, तो अपने pickled मॉडल को लोड करें और इसे सेकंड, अक्षांश और देशांतर के मानों वाली एक नमूना डेटा सरणी के खिलाफ परीक्षण करें,

```python
import pickle
model_filename = 'ufo-model.pkl'
pickle.dump(model, open(model_filename,'wb'))

model = pickle.load(open('ufo-model.pkl','rb'))
print(model.predict([[50,44,-12]]))
```

मॉडल **'3'** लौटाता है, जो यूके के लिए देश कोड है। अद्भुत! 👽

## अभ्यास - एक Flask ऐप बनाएं

अब आप अपने मॉडल को कॉल करने और समान परिणाम लौटाने के लिए एक Flask ऐप बना सकते हैं, लेकिन एक अधिक दृष्टिगत रूप से आकर्षक तरीके से।

1. _notebook.ipynb_ फाइल के बगल में **web-app** नामक एक फोल्डर बनाकर शुरू करें जहां आपकी _ufo-model.pkl_ फाइल स्थित है।

1. उस फोल्डर में तीन और फोल्डर बनाएं: **static**, जिसके अंदर एक फोल्डर **css** हो, और **templates**। अब आपके पास निम्नलिखित फाइलें और निर्देशिकाएँ होनी चाहिए:

    ```output
    web-app/
      static/
        css/
      templates/
    notebook.ipynb
    ufo-model.pkl
    ```

    ✅ समाप्त ऐप का दृश्य पाने के लिए समाधान फोल्डर का संदर्भ लें

1. _web-app_ फोल्डर में बनाने वाली पहली फाइल **requirements.txt** फाइल है। जैसे कि एक जावास्क्रिप्ट ऐप में _package.json_, यह फाइल ऐप द्वारा आवश्यक निर्भरताओं को सूचीबद्ध करती है। **requirements.txt** में निम्न पंक्तियाँ जोड़ें:

    ```text
    scikit-learn
    pandas
    numpy
    flask
    ```

1. अब, इस फाइल को _web-app_ में नेविगेट करके चलाएँ:

    ```bash
    cd web-app
    ```

1. अपने टर्मिनल में _requirements.txt_ में सूचीबद्ध लाइब्रेरीज़ को स्थापित करने के लिए `pip install` टाइप करें:

    ```bash
    pip install -r requirements.txt
    ```

1. अब, ऐप को पूरा करने के लिए तीन और फाइलें बनाने के लिए तैयार हैं:

    1. रूट में **app.py** बनाएं।
    2. _templates_ निर्देशिका में **index.html** बनाएं।
    3. _static/css_ निर्देशिका में **styles.css** बनाएं।

1. _styles.css_ फाइल को कुछ शैलियों के साथ बनाएं:

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

1. अगला, _index.html_ फाइल बनाएं:

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

    इस फाइल में टेम्पलेटिंग पर एक नज़र डालें। उन वेरिएबल्स के चारों ओर 'मस्टैच' सिंटैक्स पर ध्यान दें जिन्हें ऐप द्वारा प्रदान किया जाएगा, जैसे भविष्यवाणी टेक्स्ट: `{{}}`. There's also a form that posts a prediction to the `/predict` route.

    Finally, you're ready to build the python file that drives the consumption of the model and the display of predictions:

1. In `app.py` में जोड़ें:

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

    > 💡 टिप: जब आप [`debug=True`](https://www.askpython.com/python-modules/flask/flask-debug-mode) while running the web app using Flask, any changes you make to your application will be reflected immediately without the need to restart the server. Beware! Don't enable this mode in a production app.

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

Instead of working in a notebook and importing the model to the Flask app, you could train the model right within the Flask app! Try converting your Python code in the notebook, perhaps after your data is cleaned, to train the model from within the app on a route called `train` जोड़ते हैं तो इसके फायदे और नुकसान क्या हैं?

## [Post-lecture quiz](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/18/)

## समीक्षा और आत्म-अध्ययन

मशीन लर्निंग मॉडल का उपभोग करने के लिए एक वेब ऐप बनाने के कई तरीके हैं। उन तरीकों की एक सूची बनाएं जिनसे आप जावास्क्रिप्ट या पायथन का उपयोग करके एक वेब ऐप बना सकते हैं ताकि मशीन लर्निंग का लाभ उठाया जा सके। आर्किटेक्चर पर विचार करें: क्या मॉडल को ऐप में रहना चाहिए या क्लाउड में रहना चाहिए? यदि बाद वाला, तो आप इसे कैसे एक्सेस करेंगे? एक लागू एमएल वेब समाधान के लिए एक आर्किटेक्चरल मॉडल बनाएं।

## असाइनमेंट

[एक अलग मॉडल आज़माएं](assignment.md)

**अस्वीकरण**:
यह दस्तावेज़ मशीन-आधारित एआई अनुवाद सेवाओं का उपयोग करके अनुवादित किया गया है। जबकि हम सटीकता के लिए प्रयास करते हैं, कृपया ध्यान दें कि स्वचालित अनुवाद में त्रुटियाँ या अशुद्धियाँ हो सकती हैं। मूल भाषा में मूल दस्तावेज़ को प्रामाणिक स्रोत माना जाना चाहिए। महत्वपूर्ण जानकारी के लिए, पेशेवर मानव अनुवाद की सिफारिश की जाती है। इस अनुवाद के उपयोग से उत्पन्न किसी भी गलतफहमी या गलत व्याख्या के लिए हम उत्तरदायी नहीं हैं।