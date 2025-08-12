# मशीन लर्निंग के लिए क्लस्टरिंग मॉडल

क्लस्टरिंग एक मशीन लर्निंग कार्य है जिसमें यह उन वस्तुओं को खोजने का प्रयास करता है जो एक-दूसरे से मिलती-जुलती हैं और इन्हें समूहों में विभाजित करता है जिन्हें क्लस्टर कहा जाता है। क्लस्टरिंग को मशीन लर्निंग के अन्य दृष्टिकोणों से जो चीज अलग करती है, वह यह है कि चीजें स्वचालित रूप से होती हैं, वास्तव में, यह कहना उचित है कि यह सुपरवाइज्ड लर्निंग के विपरीत है।

## क्षेत्रीय विषय: नाइजीरियाई दर्शकों के संगीत स्वाद के लिए क्लस्टरिंग मॉडल 🎧

नाइजीरिया के विविध दर्शकों के विविध संगीत स्वाद हैं। स्पॉटिफाई से स्क्रैप किए गए डेटा का उपयोग करते हुए (इस [लेख](https://towardsdatascience.com/country-wise-visual-analysis-of-music-taste-using-spotify-api-seaborn-in-python-77f5b749b421) से प्रेरित होकर), आइए नाइजीरिया में कुछ लोकप्रिय संगीत देखें। इस डेटासेट में विभिन्न गीतों के 'डांसबिलिटी' स्कोर, 'एकॉस्टिकनेस', लाउडनेस, 'स्पीचनेस', लोकप्रियता और ऊर्जा के बारे में डेटा शामिल है। इस डेटा में पैटर्न की खोज करना दिलचस्प होगा!

![एक टर्नटेबल](../../../translated_images/turntable.f2b86b13c53302dc106aa741de9dc96ac372864cf458dd6f879119857aab01da.hi.jpg)

> फोटो <a href="https://unsplash.com/@marcelalaskoski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">मार्सेला लास्कोस्की</a> द्वारा <a href="https://unsplash.com/s/photos/nigerian-music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">अनस्प्लैश</a> पर

इस पाठ्यक्रम की श्रृंखला में, आप क्लस्टरिंग तकनीकों का उपयोग करके डेटा का विश्लेषण करने के नए तरीके खोजेंगे। क्लस्टरिंग विशेष रूप से तब उपयोगी होती है जब आपके डेटासेट में लेबल की कमी होती है। यदि इसमें लेबल होते हैं, तो पिछले पाठों में आपने जो वर्गीकरण तकनीकें सीखी हैं, वे अधिक उपयोगी हो सकती हैं। लेकिन उन मामलों में जहां आप बिना लेबल वाले डेटा को समूहित करना चाहते हैं, क्लस्टरिंग पैटर्न की खोज के लिए एक शानदार तरीका है।

> कुछ उपयोगी लो-कोड टूल हैं जो आपको क्लस्टरिंग मॉडल के साथ काम करने के बारे में जानने में मदद कर सकते हैं। इस कार्य के लिए [Azure ML का प्रयास करें](https://docs.microsoft.com/learn/modules/create-clustering-model-azure-machine-learning-designer/?WT.mc_id=academic-77952-leestott)

## पाठ

1. [क्लस्टरिंग का परिचय](1-Visualize/README.md)
2. [K-Means क्लस्टरिंग](2-K-Means/README.md)

## क्रेडिट्स

ये पाठ 🎶 के साथ [Jen Looper](https://www.twitter.com/jenlooper) द्वारा लिखे गए थे और [Rishit Dagli](https://rishit_dagli) और [Muhammad Sakib Khan Inan](https://twitter.com/Sakibinan) द्वारा सहायक समीक्षाओं के साथ।

[Nigerian Songs](https://www.kaggle.com/sootersaalu/nigerian-songs-spotify) डेटासेट को Kaggle से स्पॉटिफाई से स्क्रैप किया गया था।

उपयोगी K-Means उदाहरण जिन्होंने इस पाठ को बनाने में सहायता की, उनमें यह [iris exploration](https://www.kaggle.com/bburns/iris-exploration-pca-k-means-and-gmm-clustering), यह [introductory notebook](https://www.kaggle.com/prashant111/k-means-clustering-with-python), और यह [hypothetical NGO example](https://www.kaggle.com/ankandash/pca-k-means-clustering-hierarchical-clustering) शामिल हैं।

**अस्वीकरण**:
यह दस्तावेज़ मशीन-आधारित एआई अनुवाद सेवाओं का उपयोग करके अनुवादित किया गया है। जबकि हम सटीकता के लिए प्रयास करते हैं, कृपया ध्यान दें कि स्वचालित अनुवादों में त्रुटियाँ या अशुद्धियाँ हो सकती हैं। इसकी मूल भाषा में मूल दस्तावेज़ को प्रामाणिक स्रोत माना जाना चाहिए। महत्वपूर्ण जानकारी के लिए, पेशेवर मानव अनुवाद की सिफारिश की जाती है। इस अनुवाद के उपयोग से उत्पन्न किसी भी गलतफहमी या गलत व्याख्या के लिए हम जिम्मेदार नहीं हैं।