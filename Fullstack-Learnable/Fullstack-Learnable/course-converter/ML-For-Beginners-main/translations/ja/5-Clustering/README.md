# 機械学習のためのクラスタリングモデル

クラスタリングは、互いに似たオブジェクトを見つけ、それらをクラスタと呼ばれるグループにまとめる機械学習のタスクです。クラスタリングが他の機械学習のアプローチと異なるのは、すべてが自動的に行われる点です。実際、これは教師あり学習とは対極にあると言えます。

## 地域トピック: ナイジェリアの聴衆の音楽の好みに基づくクラスタリングモデル 🎧

ナイジェリアの多様な聴衆には、多様な音楽の好みがあります。Spotifyからスクレイピングされたデータを使用して（[この記事](https://towardsdatascience.com/country-wise-visual-analysis-of-music-taste-using-spotify-api-seaborn-in-python-77f5b749b421)に触発されて）、ナイジェリアで人気のある音楽を見てみましょう。このデータセットには、さまざまな曲の「ダンスしやすさ」スコア、「アコースティック性」、音量、「スピーチ性」、人気度、エネルギーに関するデータが含まれています。このデータの中にどのようなパターンが見つかるか、興味深いところです！

![ターンテーブル](../../../translated_images/turntable.f2b86b13c53302dc106aa741de9dc96ac372864cf458dd6f879119857aab01da.ja.jpg)

> 写真提供：<a href="https://unsplash.com/@marcelalaskoski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Marcela Laskoski</a> on <a href="https://unsplash.com/s/photos/nigerian-music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
この一連のレッスンでは、クラスタリング技術を使用してデータを分析する新しい方法を発見します。クラスタリングは、データセットにラベルがない場合に特に有用です。ラベルがある場合は、前のレッスンで学んだような分類技術の方が役立つかもしれません。しかし、ラベルのないデータをグループ化しようとしている場合、クラスタリングはパターンを発見するための優れた方法です。

> クラスタリングモデルを扱うための学習に役立つローコードツールがあります。試してみてください [Azure ML for this task](https://docs.microsoft.com/learn/modules/create-clustering-model-azure-machine-learning-designer/?WT.mc_id=academic-77952-leestott)

## レッスン

1. [クラスタリングの紹介](1-Visualize/README.md)
2. [K-Meansクラスタリング](2-K-Means/README.md)

## クレジット

これらのレッスンは🎶を持つ[Jen Looper](https://www.twitter.com/jenlooper)によって書かれ、[Rishit Dagli](https://rishit_dagli)と[Muhammad Sakib Khan Inan](https://twitter.com/Sakibinan)の役立つレビューがありました。

[Nigerian Songs](https://www.kaggle.com/sootersaalu/nigerian-songs-spotify)データセットは、SpotifyからスクレイピングされたものとしてKaggleから入手しました。

このレッスンの作成に役立った有用なK-Meansの例には、この[iris exploration](https://www.kaggle.com/bburns/iris-exploration-pca-k-means-and-gmm-clustering)、この[introductory notebook](https://www.kaggle.com/prashant111/k-means-clustering-with-python)、およびこの[hypothetical NGO example](https://www.kaggle.com/ankandash/pca-k-means-clustering-hierarchical-clustering)が含まれています。

**免責事項**：
この文書は、機械翻訳AIサービスを使用して翻訳されています。正確性を期しておりますが、自動翻訳には誤りや不正確さが含まれる場合がありますのでご注意ください。元の言語の文書が権威ある情報源とみなされるべきです。重要な情報については、専門の人間による翻訳をお勧めします。この翻訳の使用に起因する誤解や誤認について、当社は一切の責任を負いません。