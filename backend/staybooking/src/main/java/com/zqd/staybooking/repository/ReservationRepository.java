package com.zqd.staybooking.repository;

import com.zqd.staybooking.model.Reservation;
import com.zqd.staybooking.model.Stay;
import com.zqd.staybooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByGuest(User guest);

    List<Reservation> findByStay(Stay stay);

    Reservation findByIdAndGuest(Long id, User guest); // for deletion

    List<Reservation> findByStayAndCheckoutDateAfter(Stay stay, LocalDate date);

    @Query(value = "SELECT DISTINCT res.stay.id FROM Reservation res " +
            "WHERE res.stay.id IN ?1 AND " +
                "((res.checkinDate BETWEEN ?2 AND ?3) OR" +
                "(res.checkoutDate BETWEEN ?2 AND ?3))") // find the reservation already placed
    Set<Long> findByIdInAndDateBetween(List<Long> stayIds, LocalDate startDate, LocalDate endDate);

}

