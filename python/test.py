import numpy as np
import pandas as pd

df = pd.read_csv('D:\myproject\BE-BOOKSTORE\python\dataset.csv')
df.head(10)
x = df.iloc[:, :-1].values
y = df.iloc[:, -1].values


from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(x,y, test_size=0.2, random_state=42)

print("Kích thước tập huấn luyện:", X_train.shape)
print("Kích thước tập kiểm tra:", X_test.shape)

# train model SVM
from sklearn.svm import SVC
lsvm = SVC(kernel="poly", gamma="auto")
lsvm.fit(X_train, y_train)

import pickle #lưu và đọc model đã train
from os import path

pkl_filename = "D:\\myproject\\BE-BOOKSTORE\\python\\lsvm.pkl"
if (not path.isfile(pkl_filename)):
    with open(pkl_filename, 'wb') as file:
        pickle.dump(lsvm, file)
        print("Đã lưu model")
    with open(pkl_filename, 'rb') as file:
        lsvm = pickle.load(file)
        print("Đã load model")
        
from sklearn import metrics
from sklearn.metrics import accuracy_score

y_pred=lsvm.predict(X_test)
ac=accuracy_score(y_test, y_pred)*100
print("Tỷ lệ phân loại đúng: ", ac)
