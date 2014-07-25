#reading the data
require(rjson)
data<-readLines('data/data-campaign3.json')
data<-lapply(data, function(x) fromJSON(x))
data<-data.frame(Reduce(rbind, data))
data$Ptest=as.numeric(data$Ptest)
data$Atest=as.numeric(data$Atest)
data$Vtest=as.numeric(data$Vtest)
data$Pref=as.numeric(data$Pref)
data$Aref=as.numeric(data$Aref)
data$Vref=as.numeric(data$Vref)

training<-readLines('data/training-campaign3.json')
training<-lapply(training, fromJSON)
training<-data.frame(Reduce(rbind, training))

# filter incomplete users
data.uid <- as.character(data$MW_ID)
users<-names(table(data.uid))[table(data.uid)==10]

# determine quality
data.quality2 <- (data$Vtest-data$Vref)^2 + 0.3*(data$Atest-data$Aref)^2 + 0.05*(data$Ptest-data$Pref)
users.quality <- sapply(users, function(user) {
  sqrt(mean(data.quality2[data.uid==user]))
})
users.training <- sapply(users, function(user) {
  as.numeric(table(as.character(training$MW_ID))[user])/3
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

d <- data[data.uid %in% users[users.training==1], ]
l <- data.frame(rbind(lm(d$Vref ~ d$Vtest + d$Atest + d$Ptest)$coefficients,
lm(d$Aref ~ d$Vtest + d$Atest + d$Ptest)$coefficients,
lm(d$Pref ~ d$Vtest + d$Atest + d$Ptest)$coefficients), 
  row.names=c('V','A','P'))
print(l)


