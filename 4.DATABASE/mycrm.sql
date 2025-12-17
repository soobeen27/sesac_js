-- "1. 특정 사용자가 주문한 주문 목록 시간을 모두 출력하시오

select u.name, o.id ,o.orderat 
from users u join orders o 
on u.id = o.userid 
where u.id='ea768f6c-b7ae-4aff-a549-84db541f28cc';


-- 2. 특정 사용자가 주문한 상점명과 상품명을 모두 출력하시오
select u.name, s.name, i.name
from users u 
join orders o on u.id = o.userid
join stores s on o.storeid = s.id
join orderitems oi on oi.orderid = o.id
join items i on i.id = oi.itemid
where u.id='ea768f6c-b7ae-4aff-a549-84db541f28cc';

-- 3. 특정 사용자가 주문한 유닉한 상품명의 목록을 구하시오
select u.name, i.name
from users u 
join orders o on u.id = o.userid
join stores s on o.storeid = s.id
join orderitems oi on oi.orderid = o.id
join items i on i.id = oi.itemid
where u.id='ea768f6c-b7ae-4aff-a549-84db541f28cc'
group by i.name;

-- 4. 특정 사용자가 주문한 매출액의 합산을 구하시오
select sum(i.price) as TotalPrice
from orders o
join stores s on o.storeid = s.id
join orderitems oi on oi.orderid = o.id
join items i on i.id = oi.itemid
where o.userid='ea768f6c-b7ae-4aff-a549-84db541f28cc';

-- 5. 상점별 월간 통계(매출액)을 구하시오

select s.name , strftime('%Y-%m', o.orderat) AS months, sum(i.price) as monthlyrevenue
from stores s
join orders o on o.storeid = s.id
join orderitems oi on oi.orderid = o.id
join items i on oi.itemid = i.id
where s.id='e6f0e110-02b2-4990-915f-caecfe3b8e6f'
group by months;


-- 6. 특정 사용자가 방문한 상점의 빈도가 높은 순서대로 소팅하여 상위 5개만 구하시오

select s.name, count(strftime('%Y-%m-%d', o.orderat)) as visitcount
from users u
join orders o on u.id = o.userid
join stores s on s.id = o.storeid
where u.id='140024cf-c4a6-4d86-a3c7-e894cd28fbf7'
group by s.id
order by visitcount desc
limit 10;

-- 7. 구매한 매출액의 합산이 가장 높은 사용자 10명을 구하고 각각의 매출액을 구하시오
select u.id, sum(i.price) as TotalPrice
from users u
join orders o on o.userid = u.id
join orderitems oi on oi.orderid = o.id
join items i on i.id = oi.itemid
group by u.id
order by TotalPrice desc
limit 10;

-- 99. 그 외에도, 남여 성별로, 지역별로, 등등 다양한 통계 구해보기"

select type, count(name) as typeofnum
from items
group by type
order by typeofnum desc;

select type, avg(price) as avgPrice
from items
group by type
order by avgPrice desc;

select name, price
from items
order by price desc
limit 5;

select
    case
        when age < 20 then "10/20대"
        when age < 40 then "30대"
        else "40대이후"
    end as ageBand,
    count(*) as userCnt
    from users
    group by ageBand
    order by userCnt desc

select u.id, u.name, count(o.id) as orderCnt
from users u
left join orders o on u.id = o.userid
group by u.id
order by orderCnt desc;

select o.id, o.orderat, oi.id, i.name
from orders o join orderitems oi on o.id = oi.orderid
join items i on oi.itemid = i.id
order by o.orderat
limit 20;

select id, name, age, address
from users
where id in(
    select userid from orders group by userid having count(*) >= 2
) order by id;


node app.js user 100 csv
node app.js item 100 csv
node app.js store 1000 csv
node app.js order 10000 csv
node app.js orderitem 100000 csv
mv user.csv /Users/soobeenjang/Development/mycrm
mv item.csv /Users/soobeenjang/Development/mycrm
mv store.csv /Users/soobeenjang/Development/mycrm
mv order.csv /Users/soobeenjang/Development/mycrm
mv orderitem.csv /Users/soobeenjang/Development/mycrm

.mode csv
.import user.csv users
.import store.csv stores
.import order.csv orders
.import item.csv items
.import orderitem.csv orderitems