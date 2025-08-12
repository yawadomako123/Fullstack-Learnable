# 머신 러닝을 위한 클러스터링 모델

클러스터링은 서로 유사한 객체들을 찾아내어 클러스터라고 불리는 그룹으로 묶는 머신 러닝 작업입니다. 클러스터링이 머신 러닝의 다른 접근 방식과 다른 점은 모든 것이 자동으로 이루어진다는 것입니다. 사실, 이는 지도 학습과는 정반대라고 할 수 있습니다.

## 지역 주제: 나이지리아 청중의 음악 취향을 위한 클러스터링 모델 🎧

나이지리아의 다양한 청중은 다양한 음악 취향을 가지고 있습니다. [이 기사](https://towardsdatascience.com/country-wise-visual-analysis-of-music-taste-using-spotify-api-seaborn-in-python-77f5b749b421)에서 영감을 받아 Spotify에서 수집한 데이터를 사용하여 나이지리아에서 인기 있는 음악을 살펴보겠습니다. 이 데이터셋에는 다양한 노래의 '댄서빌리티' 점수, '어쿠스틱성', 음량, '스피치니스', 인기도 및 에너지에 대한 데이터가 포함되어 있습니다. 이 데이터에서 패턴을 발견하는 것은 흥미로울 것입니다!

![턴테이블](../../../translated_images/turntable.f2b86b13c53302dc106aa741de9dc96ac372864cf458dd6f879119857aab01da.ko.jpg)

> 사진 출처: <a href="https://unsplash.com/@marcelalaskoski?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Marcela Laskoski</a> on <a href="https://unsplash.com/s/photos/nigerian-music?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  
이 일련의 수업에서 클러스터링 기법을 사용하여 데이터를 분석하는 새로운 방법을 발견할 것입니다. 클러스터링은 데이터셋에 레이블이 없는 경우 특히 유용합니다. 레이블이 있는 경우 이전 수업에서 배운 분류 기법이 더 유용할 수 있습니다. 그러나 레이블이 없는 데이터를 그룹화하려는 경우 클러스터링은 패턴을 발견하는 훌륭한 방법입니다.

> 클러스터링 모델 작업에 대해 배우는 데 도움이 되는 유용한 로우 코드 도구가 있습니다. [Azure ML을 사용해 보세요](https://docs.microsoft.com/learn/modules/create-clustering-model-azure-machine-learning-designer/?WT.mc_id=academic-77952-leestott)

## 수업

1. [클러스터링 소개](1-Visualize/README.md)
2. [K-Means 클러스터링](2-K-Means/README.md)

## 크레딧

이 수업은 [Jen Looper](https://www.twitter.com/jenlooper)가 작성하고, [Rishit Dagli](https://rishit_dagli)와 [Muhammad Sakib Khan Inan](https://twitter.com/Sakibinan)의 유익한 리뷰로 완성되었습니다.

[Nigerian Songs](https://www.kaggle.com/sootersaalu/nigerian-songs-spotify) 데이터셋은 Kaggle에서 Spotify에서 수집된 데이터를 기반으로 한 것입니다.

이 수업을 만드는 데 도움이 된 유용한 K-Means 예제에는 이 [iris exploration](https://www.kaggle.com/bburns/iris-exploration-pca-k-means-and-gmm-clustering), 이 [introductory notebook](https://www.kaggle.com/prashant111/k-means-clustering-with-python), 그리고 이 [hypothetical NGO example](https://www.kaggle.com/ankandash/pca-k-means-clustering-hierarchical-clustering)이 포함됩니다.

**면책 조항**:
이 문서는 기계 기반 AI 번역 서비스를 사용하여 번역되었습니다. 우리는 정확성을 위해 노력하지만, 자동 번역에는 오류나 부정확성이 포함될 수 있습니다. 원어로 작성된 원본 문서를 권위 있는 자료로 간주해야 합니다. 중요한 정보의 경우, 전문적인 인간 번역을 권장합니다. 이 번역 사용으로 인해 발생하는 오해나 잘못된 해석에 대해서는 책임을 지지 않습니다.