-- 1. non_usa_customers.sql: 미국에 거주하지 않는 고객(전체 이름, 고객 ID 및 국가)을 표시하는 쿼리를 제공합니다.
select firstname||' '||lastname as FullName, customerid, country from customers where country!='USA';

-- 2. brazil_customers.sql: 브라질 고객만 표시하는 쿼리를 제공합니다.
select firstname||' '||lastname as FullName, customerid, country from customers where country ='Brazil';

-- 3. brazil_customers_invoices.sql: 브라질 고객의 송장을 보여주는 쿼리를 제공합니다. 
-- 결과 테이블에는 고객의 전체 이름, 송장 ID, 송장 날짜 및 청구 국가가 표시되어야 합니다.

select c.firstname||' '||c.lastname
as FullName, i.invoiceid, i.invoicedate ,i.billingcountry 
from customers c 
join invoices i 
on c.customerid = i.customerid
where c.country ='Brazil';
