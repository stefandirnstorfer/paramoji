#reading the data
require(rjson)
data<-readLines('data/data-campaign7.json')
data<-lapply(data, function(x) data.frame(fromJSON(x), stringsAsFactors=FALSE))
data<-data.frame(Reduce(rbind, data))
#data$Ptest=as.numeric(data$Ptest)
data$Atest=as.numeric(data$Atest)
data$Vtest=as.numeric(data$Vtest)
#data$Pref=as.numeric(data$Pref)
data$Aref=as.numeric(data$Aref)
data$Vref=as.numeric(data$Vref)

training<-readLines('data/training-campaign7.json')
training<-lapply(training, function(x) data.frame(fromJSON(x), stringsAsFactors=FALSE))

# filter incomplete users
data.uid <- as.character(data$MW_ID)
users<-names(table(data.uid))[table(data.uid)==10]

# determine quality
data.quality2 <- (data$Vtest==data$Vref & data$Atest==data$Aref)#+ 0.05*(data$Ptest-data$Pref)
users.quality <- sapply(users, function(user) {
  sum(data.quality2[data.uid==user])
})
users.training <- sapply(users, function(user) {
  sum(as.logical(sapply(training, function(x) x$MW_ID == user)))/3
})
plot(users.training, users.quality, col=(users.training>2)+1)
table(users.training)


# Work speed
users.speed <- as.numeric(sapply(users, function(user) {
  udata <- as.character(data[data.uid==user,]$time)
  udata <- sapply(udata, function(t) {as.POSIXct(t, format='%Y-%m-%dT%H:%M:%S')})
  (max(udata)-min(udata))/(length(udata)-1)
}))
plot(users.speed, users.quality, col=(users.training>2)+1)


# Work duration
data.step = rep(0, nrow(data))
for (user in users) { data.step[data.uid==user]=seq(1,10)}
step.quality <- sapply(seq(1,10), function(step) {
   sqrt(mean(data.quality2[data.step==step]))
})
plot(jitter(data.step), data.quality2, col=(users.training>2)+1, xlab='data.step')
lines(seq(1,10), step.quality)

f <- matrix(c(rep(c(0,.5,1), each=3), rep(c(0,.5,1), 3)), 9,2)
data2 <- data[data$MW_ID %in% users[users.training==1],]
#data2 <- data[sample(1:nrow(data2),nrow(data2),replace=T),]
Vmean = sapply(1:9, function(x) mean(data2[data2$Vref == f[x,1] & data2$Aref == f[x,2], 'Vtest']))
Amean = sapply(1:9, function(x) mean(data2[data2$Vref == f[x,1] & data2$Aref == f[x,2], 'Atest']))
plot(Vmean, Amean)
for (s in c(1,2,3)) {
  lines(Vmean[seq(3*s-2, 3*s)], Amean[seq(3*s-2, 3*s)])
  lines(Vmean[seq(s,9,by=3)], Amean[seq(s,9,by=3)])
}
