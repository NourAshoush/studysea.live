package uk.ac.bham.teamproject.repository;

import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.Friend;
import uk.ac.bham.teamproject.domain.UserExtended;

/**
 * Spring Data JPA repository for the Friend entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {
    @Query("select distinct friend.friendshipTo FROM Friend friend where friend.friendshipFrom.id =:id")
    List<UserExtended> friendsList(@Param("id") Long id);

    @Modifying
    @Query(
        "delete from Friend where (friendshipTo.id = :id and friendshipFrom.id = :id2) or (friendshipTo.id = :id2 and friendshipFrom.id = :id)"
    )
    void deletePair(@Param("id") Long id, @Param("id2") Long id2);
}
