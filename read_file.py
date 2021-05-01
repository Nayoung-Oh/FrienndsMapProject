import csv
tmp = list()
with open('./tmp.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    for line in reader:
        tmp.append(line[0])
    print(tmp)