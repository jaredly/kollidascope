
ARGS=-t [ reactify --es6 --everything --visitors jstransform/visitors/es6-destructuring-visitors ]

js:
	browserify ${ARGS} -d kol.js -o www/kol.js
