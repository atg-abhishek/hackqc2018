import os 

lst = ['cardboard', 'trash', 'paper', 'plastic', 'metal', 'glass']

for item in lst:
    for i in range(1, 40):
        os.rename("dataset-resized/"+item+"/"+item+str(i)+".jpg", "dataset-resized/training/"+item+"/"+item+str(i)+".jpg")

