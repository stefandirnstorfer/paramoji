require(rjson)
data <- readLines('usertest/game/wujinmarkus.json')
data <- lapply(data, function(x) fromJSON(x)$history)
data <- lapply(data, function(x) {
  hold <- rep(0, length(x[[1]]$data))
  lapply(x, function(y) {
    for (j in 1:length(y$data)) {
      y$data[[j]] <- list(hold = hold[j], a = y$data[[j]]$adisp/100, v = y$data[[j]]$vdisp/100)
    }
    hold[y$index+1] <<- 1-hold[y$index+1]
    y
  })
})
data <- Reduce(c, data, list())

buys <- data[sapply(data, function(x) x$action=="buy")]
v <- sapply(buys, function(item) {
  #l <- sapply(item$data, function(x) (x$hold)*(1 + 20*(1-x$v)^2)*(1 -0.8*x$a))
  l <- sapply(item$data, function(x) (1-x$hold)*(x$v^2)*(1 +2*x$a^2))
  l[[item$index+1]]/sum(l)
})
hist(v,20)
print(mean(v))
print(sum(log(v)))
