# होटल समीक्षाओं के साथ भावना विश्लेषण - डेटा प्रोसेसिंग

इस खंड में आप पिछले पाठों में सीखी गई तकनीकों का उपयोग करके एक बड़े डेटा सेट का कुछ खोजपूर्ण डेटा विश्लेषण करेंगे। एक बार जब आप विभिन्न स्तंभों की उपयोगिता को अच्छी तरह से समझ लेंगे, तो आप सीखेंगे:

- अनावश्यक स्तंभों को कैसे हटाएं
- मौजूदा स्तंभों के आधार पर कुछ नए डेटा कैसे गणना करें
- अंतिम चुनौती में उपयोग के लिए परिणामी डेटा सेट को कैसे सहेजें

## [प्री-लेक्चर क्विज़](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/37/)

### परिचय

अब तक आपने सीखा है कि पाठ डेटा संख्यात्मक प्रकार के डेटा के बिल्कुल विपरीत होता है। यदि यह पाठ किसी मानव द्वारा लिखा या बोला गया है, तो इसे पैटर्न और आवृत्तियों, भावना और अर्थ खोजने के लिए विश्लेषण किया जा सकता है। यह पाठ आपको एक वास्तविक डेटा सेट और एक वास्तविक चुनौती में ले जाता है: **[515K होटल समीक्षाएं डेटा यूरोप में](https://www.kaggle.com/jiashenliu/515k-hotel-reviews-data-in-europe)** और इसमें एक [CC0: सार्वजनिक डोमेन लाइसेंस](https://creativecommons.org/publicdomain/zero/1.0/) शामिल है। इसे Booking.com से सार्वजनिक स्रोतों से स्क्रैप किया गया था। डेटा सेट के निर्माता जियाशेन लियू थे।

### तैयारी

आपको आवश्यकता होगी:

* Python 3 का उपयोग करके .ipynb नोटबुक चलाने की क्षमता
* pandas
* NLTK, [जिसे आपको स्थानीय रूप से इंस्टॉल करना चाहिए](https://www.nltk.org/install.html)
* डेटा सेट जो Kaggle पर उपलब्ध है [515K होटल समीक्षाएं डेटा यूरोप में](https://www.kaggle.com/jiashenliu/515k-hotel-reviews-data-in-europe)। यह अनज़िप किए जाने पर लगभग 230 MB है। इसे इन NLP पाठों से संबंधित मूल `/data` फ़ोल्डर में डाउनलोड करें।

## खोजपूर्ण डेटा विश्लेषण

यह चुनौती मानती है कि आप भावना विश्लेषण और अतिथि समीक्षा स्कोर का उपयोग करके एक होटल सिफारिश बॉट बना रहे हैं। डेटा सेट जिसमें आप उपयोग करेंगे, उसमें 6 शहरों में 1493 विभिन्न होटलों की समीक्षाएं शामिल हैं।

Python, होटल समीक्षाओं के डेटा सेट और NLTK के भावना विश्लेषण का उपयोग करके आप पता लगा सकते हैं:

* समीक्षाओं में सबसे अधिक बार उपयोग किए जाने वाले शब्द और वाक्यांश क्या हैं?
* क्या होटल का वर्णन करने वाले आधिकारिक *टैग* समीक्षा स्कोर के साथ मेल खाते हैं (जैसे कि *युवा बच्चों के साथ परिवार* के लिए एक विशेष होटल की अधिक नकारात्मक समीक्षाएं हैं बजाय *एकल यात्री* के लिए, शायद यह दर्शाता है कि यह *एकल यात्रियों* के लिए बेहतर है?)
* क्या NLTK भावना स्कोर होटल समीक्षक के संख्यात्मक स्कोर से 'सहमत' हैं?

#### डेटा सेट

आइए उस डेटा सेट का पता लगाएं जिसे आपने डाउनलोड किया है और स्थानीय रूप से सहेजा है। फ़ाइल को VS Code या यहाँ तक कि Excel जैसे संपादक में खोलें।

डेटा सेट में हेडर निम्नलिखित हैं:

*Hotel_Address, Additional_Number_of_Scoring, Review_Date, Average_Score, Hotel_Name, Reviewer_Nationality, Negative_Review, Review_Total_Negative_Word_Counts, Total_Number_of_Reviews, Positive_Review, Review_Total_Positive_Word_Counts, Total_Number_of_Reviews_Reviewer_Has_Given, Reviewer_Score, Tags, days_since_review, lat, lng*

यहाँ उन्हें एक तरीके से समूहित किया गया है जो जांचने में आसान हो सकता है:
##### होटल स्तंभ

* `Hotel_Name`, `Hotel_Address`, `lat` (अक्षांश), `lng` (देशांतर)
  * *lat* और *lng* का उपयोग करके आप होटल स्थान दिखाने के लिए Python के साथ एक मानचित्र बना सकते हैं (शायद नकारात्मक और सकारात्मक समीक्षाओं के लिए रंग कोडित)
  * Hotel_Address हमारे लिए स्पष्ट रूप से उपयोगी नहीं है, और हम शायद इसे आसान छंटाई और खोज के लिए एक देश के साथ बदल देंगे

**होटल मेटा-समीक्षा स्तंभ**

* `Average_Score`
  * डेटा सेट निर्माता के अनुसार, यह स्तंभ *होटल का औसत स्कोर है, जो पिछले वर्ष में नवीनतम टिप्पणी के आधार पर गणना किया गया है*। यह स्कोर की गणना करने का एक असामान्य तरीका लगता है, लेकिन यह स्क्रैप किया गया डेटा है इसलिए हम इसे अभी के लिए फेस वैल्यू पर ले सकते हैं।
  
  ✅ इस डेटा के अन्य स्तंभों के आधार पर, क्या आप औसत स्कोर की गणना करने का कोई और तरीका सोच सकते हैं?

* `Total_Number_of_Reviews`
  * इस होटल को प्राप्त समीक्षाओं की कुल संख्या - यह स्पष्ट नहीं है (कुछ कोड लिखे बिना) कि यह डेटा सेट में समीक्षाओं को संदर्भित करता है या नहीं।
* `Additional_Number_of_Scoring`
  * इसका मतलब है कि एक समीक्षा स्कोर दिया गया था लेकिन समीक्षक द्वारा कोई सकारात्मक या नकारात्मक समीक्षा नहीं लिखी गई थी

**समीक्षा स्तंभ**

- `Reviewer_Score`
  - यह एक संख्यात्मक मान है जिसमें न्यूनतम और अधिकतम मान 2.5 और 10 के बीच सबसे अधिक 1 दशमलव स्थान है
  - यह स्पष्ट नहीं किया गया है कि 2.5 सबसे कम संभव स्कोर क्यों है
- `Negative_Review`
  - यदि एक समीक्षक ने कुछ नहीं लिखा, तो इस फ़ील्ड में "**No Negative**" होगा
  - ध्यान दें कि एक समीक्षक नकारात्मक समीक्षा स्तंभ में सकारात्मक समीक्षा लिख ​​सकता है (जैसे "इस होटल के बारे में कुछ भी बुरा नहीं है")
- `Review_Total_Negative_Word_Counts`
  - उच्च नकारात्मक शब्द गणना से कम स्कोर का संकेत मिलता है (भावना की जांच किए बिना)
- `Positive_Review`
  - यदि एक समीक्षक ने कुछ नहीं लिखा, तो इस फ़ील्ड में "**No Positive**" होगा
  - ध्यान दें कि एक समीक्षक सकारात्मक समीक्षा स्तंभ में नकारात्मक समीक्षा लिख ​​सकता है (जैसे "इस होटल के बारे में कुछ भी अच्छा नहीं है")
- `Review_Total_Positive_Word_Counts`
  - उच्च सकारात्मक शब्द गणना से उच्च स्कोर का संकेत मिलता है (भावना की जांच किए बिना)
- `Review_Date` और `days_since_review`
  - एक समीक्षा पर ताजगी या बासीपन का माप लागू किया जा सकता है (पुरानी समीक्षाएं नई समीक्षाओं के रूप में सटीक नहीं हो सकती हैं क्योंकि होटल प्रबंधन बदल गया है, या नवीनीकरण किया गया है, या एक पूल जोड़ा गया है आदि)
- `Tags`
  - ये छोटे वर्णनकर्ता होते हैं जिन्हें एक समीक्षक यह वर्णन करने के लिए चुन सकता है कि वे किस प्रकार के अतिथि थे (जैसे एकल या परिवार), उनके पास किस प्रकार का कमरा था, ठहरने की अवधि और समीक्षा कैसे प्रस्तुत की गई थी।
  - दुर्भाग्य से, इन टैग्स का उपयोग करना समस्याग्रस्त है, उनकी उपयोगिता पर चर्चा करने वाला खंड देखें

**समीक्षक स्तंभ**

- `Total_Number_of_Reviews_Reviewer_Has_Given`
  - यह सिफारिश मॉडल में एक कारक हो सकता है, उदाहरण के लिए, यदि आप यह निर्धारित कर सकते हैं कि सैकड़ों समीक्षाओं के साथ अधिक विपुल समीक्षक नकारात्मक होने की तुलना में सकारात्मक होने की अधिक संभावना रखते थे। हालाँकि, किसी विशेष समीक्षा के समीक्षक को एक अद्वितीय कोड के साथ पहचाना नहीं गया है, और इसलिए इसे समीक्षाओं के एक सेट से जोड़ा नहीं जा सकता है। 100 या अधिक समीक्षाओं वाले 30 समीक्षक हैं, लेकिन यह देखना मुश्किल है कि यह सिफारिश मॉडल में कैसे मदद कर सकता है।
- `Reviewer_Nationality`
  - कुछ लोगों का मानना ​​है कि कुछ राष्ट्रीयताओं के लोगों के सकारात्मक या नकारात्मक समीक्षा देने की संभावना अधिक होती है क्योंकि उनके पास एक राष्ट्रीय प्रवृत्ति होती है। अपने मॉडलों में इस तरह के उपाख्यानात्मक विचारों को शामिल करने से सावधान रहें। ये राष्ट्रीय (और कभी-कभी नस्लीय) रूढ़िवादिता हैं, और प्रत्येक समीक्षक एक व्यक्ति था जिसने अपने अनुभव के आधार पर एक समीक्षा लिखी। इसे उनके कई लेंसों के माध्यम से फ़िल्टर किया गया हो सकता है जैसे कि उनके पिछले होटल में ठहराव, यात्रा की दूरी और उनके व्यक्तिगत स्वभाव। यह सोचना कि उनकी राष्ट्रीयता समीक्षा स्कोर का कारण थी, सही ठहराना मुश्किल है।

##### उदाहरण

| औसत स्कोर | कुल समीक्षाओं की संख्या | समीक्षक स्कोर | नकारात्मक <br />समीक्षा                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | सकारात्मक समीक्षा                 | टैग्स                                                                                      |
| -------------- | ---------------------- | ---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| 7.8            | 1945                   | 2.5              | यह वर्तमान में एक होटल नहीं है बल्कि एक निर्माण स्थल है मुझे लंबे सफर के बाद आराम करने और कमरे में काम करने के दौरान सुबह से लेकर पूरे दिन अस्वीकार्य निर्माण शोर से आतंकित किया गया लोग पूरे दिन काम कर रहे थे यानी आसन्न कमरों में जैकहैमर के साथ मैंने कमरे में बदलाव के लिए कहा लेकिन कोई शांत कमरा उपलब्ध नहीं था चीजों को और भी खराब करने के लिए मुझसे अधिक शुल्क लिया गया मैंने शाम को चेक आउट किया क्योंकि मुझे बहुत जल्दी उड़ान भरनी थी और मुझे उपयुक्त बिल मिला एक दिन बाद होटल ने मेरी सहमति के बिना बुक की गई कीमत से अधिक का एक और शुल्क लिया यह एक भयानक जगह है यहाँ बुकिंग करके खुद को सजा न दें | कुछ नहीं भयानक जगह दूर रहें | व्यापार यात्रा                                युगल मानक डबल कमरा 2 रात रुके |

जैसा कि आप देख सकते हैं, इस अतिथि का इस होटल में ठहराव सुखद नहीं था। होटल का औसत स्कोर 7.8 है और 1945 समीक्षाएं हैं, लेकिन इस समीक्षक ने इसे 2.5 दिया और उनके ठहराव के बारे में 115 शब्द लिखे कि यह कितना नकारात्मक था। यदि उन्होंने सकारात्मक समीक्षा कॉलम में कुछ भी नहीं लिखा, तो आप अनुमान लगा सकते हैं कि कुछ भी सकारात्मक नहीं था, लेकिन अफसोस, उन्होंने चेतावनी के 7 शब्द लिखे। यदि हम शब्दों की बजाय शब्दों का अर्थ या भावना गिनते हैं, तो हमें समीक्षक के इरादे का विकृत दृश्य मिल सकता है। अजीब तरह से, उनका स्कोर 2.5 भ्रमित करने वाला है, क्योंकि यदि वह होटल ठहराव इतना बुरा था, तो उन्होंने इसे कोई अंक क्यों दिए? डेटा सेट का बारीकी से निरीक्षण करने पर, आप देखेंगे कि सबसे कम संभव स्कोर 2.5 है, 0 नहीं। सबसे अधिक संभव स्कोर 10 है।

##### टैग्स

जैसा कि ऊपर उल्लेख किया गया है, पहली नज़र में, डेटा को वर्गीकृत करने के लिए `Tags` का उपयोग करने का विचार समझ में आता है। दुर्भाग्य से ये टैग मानकीकृत नहीं हैं, जिसका अर्थ है कि किसी दिए गए होटल में, विकल्प *एकल कमरा*, *जुड़वां कमरा*, और *डबल कमरा* हो सकते हैं, लेकिन अगले होटल में वे *डीलक्स एकल कमरा*, *क्लासिक क्वीन कमरा*, और *एक्जीक्यूटिव किंग कमरा* हो सकते हैं। ये वही चीजें हो सकती हैं, लेकिन इतनी सारी विविधताएं हैं कि विकल्प बन जाता है:

1. सभी शर्तों को एकल मानक में बदलने का प्रयास करें, जो बहुत कठिन है, क्योंकि यह स्पष्ट नहीं है कि प्रत्येक मामले में रूपांतरण पथ क्या होगा (जैसे *क्लासिक सिंगल रूम* को *सिंगल रूम* से मैप करता है लेकिन *आंगन गार्डन या सिटी व्यू के साथ सुपीरियर क्वीन रूम* को मैप करना बहुत कठिन है)

1. हम एक NLP दृष्टिकोण ले सकते हैं और प्रत्येक होटल पर लागू होने वाले *सोलो*, *बिजनेस ट्रैवलर*, या *युवा बच्चों के साथ परिवार* जैसे कुछ शब्दों की आवृत्ति को माप सकते हैं, और इसे सिफारिश में कारक बना सकते हैं

टैग आमतौर पर (लेकिन हमेशा नहीं) एकल फ़ील्ड होते हैं जिनमें *यात्रा का प्रकार*, *अतिथियों का प्रकार*, *कमरे का प्रकार*, *रातों की संख्या*, और *प्रकार का डिवाइस समीक्षा प्रस्तुत की गई थी* के अनुरूप 5 से 6 अल्पविराम से अलग मानों की सूची होती है। हालाँकि, क्योंकि कुछ समीक्षक प्रत्येक फ़ील्ड को नहीं भरते हैं (वे एक को खाली छोड़ सकते हैं), मान हमेशा एक ही क्रम में नहीं होते हैं।

उदाहरण के लिए, *समूह का प्रकार* लें। `Tags` स्तंभ में इस फ़ील्ड में 1025 अनूठी संभावनाएं हैं, और दुर्भाग्य से उनमें से केवल कुछ ही समूह को संदर्भित करती हैं (कुछ कमरे के प्रकार आदि हैं)। यदि आप केवल उन लोगों को फ़िल्टर करते हैं जो परिवार का उल्लेख करते हैं, तो परिणामों में कई *फैमिली रूम* प्रकार के परिणाम होते हैं। यदि आप *साथ* शब्द को शामिल करते हैं, यानी *फैमिली विथ* मानों की गणना करें, तो परिणाम बेहतर होते हैं, 515,000 परिणामों में से 80,000 से अधिक में "युवा बच्चों के साथ परिवार" या "बड़े बच्चों के साथ परिवार" वाक्यांश होता है।

इसका मतलब है कि टैग कॉलम हमारे लिए पूरी तरह से बेकार नहीं है, लेकिन इसे उपयोगी बनाने के लिए कुछ काम करना होगा।

##### औसत होटल स्कोर

डेटा सेट के साथ कई विचित्रताएँ या विसंगतियाँ हैं जिन्हें मैं समझ नहीं पा रहा हूँ, लेकिन जब आप अपने मॉडल बना रहे हैं तो आप उनसे अवगत रहें इसके लिए यहाँ चित्रित किया गया है। यदि आप इसका पता लगाते हैं, तो कृपया हमें चर्चा अनुभाग में बताएं!

डेटा सेट में औसत स्कोर और समीक्षाओं की संख्या से संबंधित निम्नलिखित स्तंभ हैं:

1. Hotel_Name
2. Additional_Number_of_Scoring
3. Average_Score
4. Total_Number_of_Reviews
5. Reviewer_Score  

इस डेटा सेट में सबसे अधिक समीक्षाओं वाला एकल होटल *ब्रिटानिया इंटरनेशनल होटल कैनरी व्हार्फ* है जिसमें 515,000 में से 4789 समीक्षाएं हैं। लेकिन अगर हम इस होटल के `Total_Number_of_Reviews` मान को देखते हैं, तो यह 9086 है। आप यह अनुमान लगा सकते हैं कि समीक्षाओं के बिना कई और स्कोर हैं, इसलिए शायद हमें `Additional_Number_of_Scoring` स्तंभ मान जोड़ना चाहिए। वह मान 2682 है, और इसे 4789 में जोड़ने से हमें 7,471 मिलते हैं जो अभी भी `Total_Number_of_Reviews` से 1615 कम हैं।

यदि आप `Average_Score` स्तंभ लेते हैं, तो आप यह अनुमान लगा सकते हैं कि यह डेटा सेट में समीक्षाओं का औसत है, लेकिन Kaggle का विवरण है "*होटल का औसत स्कोर, पिछले वर्ष में नवीनतम टिप्पणी के आधार पर गणना किया गया*। यह इतना उपयोगी नहीं लगता है, लेकिन हम डेटा सेट में समीक्षा स्कोर के आधार पर अपना औसत गणना कर सकते हैं। उदाहरण के लिए एक ही होटल का उपयोग करते हुए, औसत होटल स्कोर 7.1 दिया गया है लेकिन गणना किया गया स्कोर (डेटा सेट में औसत समीक्षक स्कोर) 6.8 है। यह करीब है, लेकिन समान मूल्य नहीं है, और हम केवल यह अनुमान लगा सकते हैं कि `Additional_Number_of_Scoring` समीक्षाओं में दिए गए स्कोर ने औसत को 7.1 तक बढ़ा दिया। दुर्भाग्य से उस दावे का परीक्षण या प्रमाणित करने का कोई तरीका नहीं होने के कारण, `Average_Score`, `Additional_Number_of_Scoring` और `Total_Number_of_Reviews` का उपयोग करना या उन पर भरोसा करना मुश्किल है जब वे डेटा पर आधारित होते हैं या डेटा का संदर्भ देते हैं जो हमारे पास नहीं है।

चीजों को और अधिक जटिल बनाने के लिए, सबसे अधिक समीक्षाओं वाले दूसरे होटल का औसत स्कोर 8.12 है और डेटा सेट `Average_Score` 8.1 है। क्या यह सही स्कोर एक संयोग है या पहला होटल एक विसंगति है?

इस संभावना पर कि ये होटल एक बाहरी हो सकते हैं, और हो सकता है कि अधिकांश मान सही हों (लेकिन कुछ कारणों से नहीं हैं) हम डेटा सेट में मानों का पता लगाने और मानों के सही उपयोग (या गैर-उपयोग) का निर्धारण करने के लिए अगला एक छोटा कार्यक्रम लिखेंगे।

> 🚨 एक सावधानी नोट
>
> इस डेटा सेट के साथ काम करते समय आप कुछ कोड लिखेंगे जो पाठ से कुछ गणना करता है बिना आपको स्वयं पाठ पढ़ने या विश्लेषण करने की आवश्यकता के। यह NLP का सार है, बिना किसी मानव को यह करने की आवश्यकता के अर्थ या भावना की व्याख्या करना। हालाँकि, यह संभव है कि आप कुछ नकारात्मक समीक्षाएँ पढ़ेंगे। मैं आपसे आग्रह करूंगा कि आप ऐसा न करें, क्योंकि आपको ऐसा करने की आवश्यकता नहीं है। उनमें से कुछ बेवकूफी भरी हैं, या अप्रासंगिक नकारात्मक होटल समीक्षाएँ हैं, जैसे "मौसम अच्छा नहीं था", जो होटल के नियंत्रण से परे कुछ है, या वास्तव में, किसी का भी। लेकिन कुछ समीक्षाओं का एक काला पक्ष भी है। कभी-कभी नकारात्मक समीक्षाएँ नस्लवादी, सेक्सिस्ट या आयुर्वादी होती हैं। यह दुर्भाग्यपूर्ण है लेकिन सार्वजनिक वेबसाइट से स्क्रैप किए गए डेटा सेट में अपेक्षित है। कुछ समीक्षक ऐसी समीक्षाएँ छोड़ते हैं जिन्हें आप घृणित, असहज या परेशान करने वाली पाते हैं। भावना को मापने के लिए कोड को पढ़ने के बजाय उन्हें स्वयं पढ़ना और परेशान होना बेहतर है। ऐसा कहा जा रहा है, यह एक अल्प
पंक्तियों में कॉलम `Positive_Review` के मान "No Positive" हैं 9. गणना करें और प्रिंट करें कि कितनी पंक्तियों में कॉलम `Positive_Review` के मान "No Positive" **और** `Negative_Review` के मान "No Negative" हैं ### कोड उत्तर 1. आपने जो डेटा फ्रेम लोड किया है उसका *आकार* प्रिंट करें (आकार पंक्तियों और कॉलमों की संख्या है) ```python
   print("The shape of the data (rows, cols) is " + str(df.shape))
   > The shape of the data (rows, cols) is (515738, 17)
   ``` 2. समीक्षक राष्ट्रीयताओं के लिए आवृत्ति गणना करें: 1. कॉलम `Reviewer_Nationality` के लिए कितने विशिष्ट मान हैं और वे क्या हैं? 2. डेटासेट में सबसे आम समीक्षक राष्ट्रीयता कौन सी है (देश और समीक्षाओं की संख्या प्रिंट करें)? ```python
   # value_counts() creates a Series object that has index and values in this case, the country and the frequency they occur in reviewer nationality
   nationality_freq = df["Reviewer_Nationality"].value_counts()
   print("There are " + str(nationality_freq.size) + " different nationalities")
   # print first and last rows of the Series. Change to nationality_freq.to_string() to print all of the data
   print(nationality_freq) 
   
   There are 227 different nationalities
    United Kingdom               245246
    United States of America      35437
    Australia                     21686
    Ireland                       14827
    United Arab Emirates          10235
                                  ...  
    Comoros                           1
    Palau                             1
    Northern Mariana Islands          1
    Cape Verde                        1
    Guinea                            1
   Name: Reviewer_Nationality, Length: 227, dtype: int64
   ``` 3. अगली 10 सबसे अधिक बार पाई जाने वाली राष्ट्रीयताएँ और उनकी आवृत्ति गणना क्या हैं? ```python
      print("The highest frequency reviewer nationality is " + str(nationality_freq.index[0]).strip() + " with " + str(nationality_freq[0]) + " reviews.")
      # Notice there is a leading space on the values, strip() removes that for printing
      # What is the top 10 most common nationalities and their frequencies?
      print("The next 10 highest frequency reviewer nationalities are:")
      print(nationality_freq[1:11].to_string())
      
      The highest frequency reviewer nationality is United Kingdom with 245246 reviews.
      The next 10 highest frequency reviewer nationalities are:
       United States of America     35437
       Australia                    21686
       Ireland                      14827
       United Arab Emirates         10235
       Saudi Arabia                  8951
       Netherlands                   8772
       Switzerland                   8678
       Germany                       7941
       Canada                        7894
       France                        7296
      ``` 3. शीर्ष 10 सबसे समीक्षक राष्ट्रीयताओं में से प्रत्येक के लिए सबसे अधिक बार समीक्षा किया गया होटल कौन सा था? ```python
   # What was the most frequently reviewed hotel for the top 10 nationalities
   # Normally with pandas you will avoid an explicit loop, but wanted to show creating a new dataframe using criteria (don't do this with large amounts of data because it could be very slow)
   for nat in nationality_freq[:10].index:
      # First, extract all the rows that match the criteria into a new dataframe
      nat_df = df[df["Reviewer_Nationality"] == nat]   
      # Now get the hotel freq
      freq = nat_df["Hotel_Name"].value_counts()
      print("The most reviewed hotel for " + str(nat).strip() + " was " + str(freq.index[0]) + " with " + str(freq[0]) + " reviews.") 
      
   The most reviewed hotel for United Kingdom was Britannia International Hotel Canary Wharf with 3833 reviews.
   The most reviewed hotel for United States of America was Hotel Esther a with 423 reviews.
   The most reviewed hotel for Australia was Park Plaza Westminster Bridge London with 167 reviews.
   The most reviewed hotel for Ireland was Copthorne Tara Hotel London Kensington with 239 reviews.
   The most reviewed hotel for United Arab Emirates was Millennium Hotel London Knightsbridge with 129 reviews.
   The most reviewed hotel for Saudi Arabia was The Cumberland A Guoman Hotel with 142 reviews.
   The most reviewed hotel for Netherlands was Jaz Amsterdam with 97 reviews.
   The most reviewed hotel for Switzerland was Hotel Da Vinci with 97 reviews.
   The most reviewed hotel for Germany was Hotel Da Vinci with 86 reviews.
   The most reviewed hotel for Canada was St James Court A Taj Hotel London with 61 reviews.
   ``` 4. डेटासेट में प्रति होटल कितनी समीक्षाएँ हैं (होटल की आवृत्ति गणना)? ```python
   # First create a new dataframe based on the old one, removing the uneeded columns
   hotel_freq_df = df.drop(["Hotel_Address", "Additional_Number_of_Scoring", "Review_Date", "Average_Score", "Reviewer_Nationality", "Negative_Review", "Review_Total_Negative_Word_Counts", "Positive_Review", "Review_Total_Positive_Word_Counts", "Total_Number_of_Reviews_Reviewer_Has_Given", "Reviewer_Score", "Tags", "days_since_review", "lat", "lng"], axis = 1)
   
   # Group the rows by Hotel_Name, count them and put the result in a new column Total_Reviews_Found
   hotel_freq_df['Total_Reviews_Found'] = hotel_freq_df.groupby('Hotel_Name').transform('count')
   
   # Get rid of all the duplicated rows
   hotel_freq_df = hotel_freq_df.drop_duplicates(subset = ["Hotel_Name"])
   display(hotel_freq_df) 
   ``` | Hotel_Name | Total_Number_of_Reviews | Total_Reviews_Found | | :----------------------------------------: | :---------------------: | :-----------------: | | Britannia International Hotel Canary Wharf | 9086 | 4789 | | Park Plaza Westminster Bridge London | 12158 | 4169 | | Copthorne Tara Hotel London Kensington | 7105 | 3578 | | ... | ... | ... | | Mercure Paris Porte d Orleans | 110 | 10 | | Hotel Wagner | 135 | 10 | | Hotel Gallitzinberg | 173 | 8 | आप देख सकते हैं कि *डेटासेट में गिना गया* परिणाम `Total_Number_of_Reviews` में मान से मेल नहीं खाता है। यह स्पष्ट नहीं है कि क्या डेटासेट में यह मान होटल की कुल समीक्षाओं का प्रतिनिधित्व करता था, लेकिन सभी स्क्रैप नहीं की गईं, या कुछ अन्य गणना। इस अस्पष्टता के कारण `Total_Number_of_Reviews` को मॉडल में उपयोग नहीं किया गया है। 5. जबकि डेटासेट में प्रत्येक होटल के लिए एक `Average_Score` कॉलम है, आप एक औसत स्कोर भी गणना कर सकते हैं (प्रत्येक होटल के लिए डेटासेट में सभी समीक्षक स्कोर का औसत प्राप्त करना)। अपने डेटा फ्रेम में एक नया कॉलम जोड़ें जिसका कॉलम हेडर `Calc_Average_Score` हो और जिसमें वह गणना किया गया औसत हो। कॉलम `Hotel_Name`, `Average_Score`, और `Calc_Average_Score` प्रिंट करें। ```python
   # define a function that takes a row and performs some calculation with it
   def get_difference_review_avg(row):
     return row["Average_Score"] - row["Calc_Average_Score"]
   
   # 'mean' is mathematical word for 'average'
   df['Calc_Average_Score'] = round(df.groupby('Hotel_Name').Reviewer_Score.transform('mean'), 1)
   
   # Add a new column with the difference between the two average scores
   df["Average_Score_Difference"] = df.apply(get_difference_review_avg, axis = 1)
   
   # Create a df without all the duplicates of Hotel_Name (so only 1 row per hotel)
   review_scores_df = df.drop_duplicates(subset = ["Hotel_Name"])
   
   # Sort the dataframe to find the lowest and highest average score difference
   review_scores_df = review_scores_df.sort_values(by=["Average_Score_Difference"])
   
   display(review_scores_df[["Average_Score_Difference", "Average_Score", "Calc_Average_Score", "Hotel_Name"]])
   ``` आप `Average_Score` मान के बारे में भी सोच सकते हैं और क्यों यह कभी-कभी गणना किए गए औसत स्कोर से भिन्न होता है। जैसा कि हम नहीं जान सकते कि कुछ मान मेल खाते हैं, लेकिन अन्य में अंतर है, इस मामले में हमारे पास जो समीक्षा स्कोर हैं उनका उपयोग करके औसत स्वयं गणना करना सबसे सुरक्षित है। कहा जा रहा है, अंतर आमतौर पर बहुत छोटे होते हैं, यहाँ डेटासेट औसत और गणना किए गए औसत से सबसे बड़े विचलन वाले होटल हैं: | Average_Score_Difference | Average_Score | Calc_Average_Score | Hotel_Name | | :----------------------: | :-----------: | :----------------: | ------------------------------------------: | | -0.8 | 7.7 | 8.5 | Best Western Hotel Astoria | | -0.7 | 8.8 | 9.5 | Hotel Stendhal Place Vend me Paris MGallery | | -0.7 | 7.5 | 8.2 | Mercure Paris Porte d Orleans | | -0.7 | 7.9 | 8.6 | Renaissance Paris Vendome Hotel | | -0.5 | 7.0 | 7.5 | Hotel Royal Elys es | | ... | ... | ... | ... | | 0.7 | 7.5 | 6.8 | Mercure Paris Op ra Faubourg Montmartre | | 0.8 | 7.1 | 6.3 | Holiday Inn Paris Montparnasse Pasteur | | 0.9 | 6.8 | 5.9 | Villa Eugenie | | 0.9 | 8.6 | 7.7 | MARQUIS Faubourg St Honor Relais Ch teaux | | 1.3 | 7.2 | 5.9 | Kube Hotel Ice Bar | केवल 1 होटल के साथ जिसका स्कोर अंतर 1 से अधिक है, इसका मतलब है कि हम संभवतः अंतर को अनदेखा कर सकते हैं और गणना किए गए औसत स्कोर का उपयोग कर सकते हैं। 6. गणना करें और प्रिंट करें कि कितनी पंक्तियों में कॉलम `Negative_Review` के मान "No Negative" हैं 7. गणना करें और प्रिंट करें कि कितनी पंक्तियों में कॉलम `Positive_Review` के मान "No Positive" हैं 8. गणना करें और प्रिंट करें कि कितनी पंक्तियों में कॉलम `Positive_Review` के मान "No Positive" **और** `Negative_Review` के मान "No Negative" हैं ```python
   # with lambdas:
   start = time.time()
   no_negative_reviews = df.apply(lambda x: True if x['Negative_Review'] == "No Negative" else False , axis=1)
   print("Number of No Negative reviews: " + str(len(no_negative_reviews[no_negative_reviews == True].index)))
   
   no_positive_reviews = df.apply(lambda x: True if x['Positive_Review'] == "No Positive" else False , axis=1)
   print("Number of No Positive reviews: " + str(len(no_positive_reviews[no_positive_reviews == True].index)))
   
   both_no_reviews = df.apply(lambda x: True if x['Negative_Review'] == "No Negative" and x['Positive_Review'] == "No Positive" else False , axis=1)
   print("Number of both No Negative and No Positive reviews: " + str(len(both_no_reviews[both_no_reviews == True].index)))
   end = time.time()
   print("Lambdas took " + str(round(end - start, 2)) + " seconds")
   
   Number of No Negative reviews: 127890
   Number of No Positive reviews: 35946
   Number of both No Negative and No Positive reviews: 127
   Lambdas took 9.64 seconds
   ``` ## एक और तरीका एक और तरीका बिना लैम्ब्डास के आइटम गिनना, और पंक्तियों को गिनने के लिए सम का उपयोग करना: ```python
   # without lambdas (using a mixture of notations to show you can use both)
   start = time.time()
   no_negative_reviews = sum(df.Negative_Review == "No Negative")
   print("Number of No Negative reviews: " + str(no_negative_reviews))
   
   no_positive_reviews = sum(df["Positive_Review"] == "No Positive")
   print("Number of No Positive reviews: " + str(no_positive_reviews))
   
   both_no_reviews = sum((df.Negative_Review == "No Negative") & (df.Positive_Review == "No Positive"))
   print("Number of both No Negative and No Positive reviews: " + str(both_no_reviews))
   
   end = time.time()
   print("Sum took " + str(round(end - start, 2)) + " seconds")
   
   Number of No Negative reviews: 127890
   Number of No Positive reviews: 35946
   Number of both No Negative and No Positive reviews: 127
   Sum took 0.19 seconds
   ``` आपने देखा होगा कि कॉलम `Negative_Review` और `Positive_Review` के लिए क्रमशः "No Negative" और "No Positive" मानों वाली 127 पंक्तियाँ हैं। इसका मतलब है कि समीक्षक ने होटल को एक संख्यात्मक स्कोर दिया, लेकिन सकारात्मक या नकारात्मक समीक्षा लिखने से इनकार कर दिया। सौभाग्य से यह एक छोटी मात्रा की पंक्तियाँ हैं (515738 में से 127, या 0.02%), इसलिए यह संभवतः हमारे मॉडल या परिणामों को किसी विशेष दिशा में नहीं ले जाएगा, लेकिन आप एक डेटा सेट की समीक्षा करने की उम्मीद नहीं कर सकते जिसमें कोई समीक्षा नहीं है, इसलिए यह डेटा का पता लगाने लायक है ताकि ऐसी पंक्तियों की खोज की जा सके। अब जब आपने डेटासेट का पता लगा लिया है, अगली कक्षा में आप डेटा को फ़िल्टर करेंगे और कुछ भावना विश्लेषण जोड़ेंगे। --- ## 🚀चुनौती यह पाठ प्रदर्शित करता है, जैसा कि हमने पिछले पाठों में देखा, डेटा और इसकी खामियों को समझना कितना महत्वपूर्ण है इससे पहले कि आप उस पर संचालन करें। विशेष रूप से, टेक्स्ट-आधारित डेटा सावधानीपूर्वक जांच का सामना करता है। विभिन्न टेक्स्ट-भारी डेटा सेटों के माध्यम से खुदाई करें और देखें कि क्या आप ऐसे क्षेत्र खोज सकते हैं जो मॉडल में पूर्वाग्रह या विकृत भावना ला सकते हैं। ## [पोस्ट-व्याख्यान प्रश्नोत्तरी](https://gray-sand-07a10f403.1.azurestaticapps.net/quiz/38/) ## समीक्षा और आत्म अध्ययन [इस NLP लर्निंग पाथ](https://docs.microsoft.com/learn/paths/explore-natural-language-processing/?WT.mc_id=academic-77952-leestott) को लें और भाषण और टेक्स्ट-भारी मॉडल बनाने के लिए प्रयास करने के लिए उपकरण खोजें। ## असाइनमेंट [NLTK](assignment.md)

**अस्वीकरण**:
यह दस्तावेज़ मशीन-आधारित एआई अनुवाद सेवाओं का उपयोग करके अनुवादित किया गया है। जबकि हम सटीकता के लिए प्रयास करते हैं, कृपया ध्यान दें कि स्वचालित अनुवाद में त्रुटियाँ या अशुद्धियाँ हो सकती हैं। मूल भाषा में मूल दस्तावेज़ को प्रामाणिक स्रोत माना जाना चाहिए। महत्वपूर्ण जानकारी के लिए, पेशेवर मानव अनुवाद की सिफारिश की जाती है। इस अनुवाद के उपयोग से उत्पन्न किसी भी गलतफहमी या गलत व्याख्या के लिए हम उत्तरदायी नहीं हैं।