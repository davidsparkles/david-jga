cd ./frontend && yarn build && cd ..
git add .
git commit -m "release"
git push origin master
caprover deploy --default
